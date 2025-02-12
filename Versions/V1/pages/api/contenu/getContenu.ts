import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

async function connect() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
    }

    const params = req.body;

    try {
        const connection = await connect();

        switch (params.action) {
            case 0: { // Récupérer un contenu par ID
                if (!params.id) {
                    await connection.end();
                    return res.status(400).json({ error: "L'ID du contenu est requis." });
                }

                const [content] = await connection.execute<RowDataPacket[]>(
                    "SELECT * FROM Contenu WHERE idContenu = ?",
                    [params.id]
                );

                await connection.end();

                if ((content as RowDataPacket[]).length === 0) {
                    return res.status(404).json({ error: "Contenu non trouvé." });
                }

                return res.status(200).json(content);
            }

            case 1: { // Rechercher du contenu avec des critères (titre et/ou type)
                let sql = "SELECT idContenu, titre, description, type, imagePrincContenu, specificData FROM Contenu";
                const whereClauses: string[] = [];
                const values: (string | number)[] = [];

                if (params.titre) {
                    whereClauses.push("UPPER(titre) LIKE UPPER(?)");
                    values.push(`%${params.titre}%`);
                }
                if (params.type) {
                    whereClauses.push("type = ?");
                    values.push(params.type);
                }

                if (whereClauses.length > 0) {
                    sql += " WHERE " + whereClauses.join(" AND ");
                }

                const [results] = await connection.execute<RowDataPacket[]>(sql, values);
                await connection.end();

                return res.status(200).json(results);
            }

            default: { // Récupérer tout le contenu
                const [allContent] = await connection.execute<RowDataPacket[]>("SELECT * FROM Contenu");
                await connection.end();
                return res.status(200).json(allContent);
            }
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
}
