import { NextApiRequest, NextApiResponse } from 'next';
import mysql, {RowDataPacket} from 'mysql2/promise';

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

    // console.log("Received request body:", req.body);

    const params = req.body;

    try {
        const connection = await connect();

        switch (params.action) {
            case 0: // Récupérer un contenu par ID
                if (!params.id) {
                    await connection.end();
                    return res.status(400).json({ error: "L'ID du contenu est requis." });
                }

                const [content] = await connection.execute<RowDataPacket[]>(
                    "SELECT * FROM Contenu WHERE idContenu = ?",
                    [params.id]
                );

                if (content.length === 0) {
                    await connection.end();
                    return res.status(404).json({ error: "Contenu non trouvé." });
                }

                await connection.end();
                return res.status(200).json(content);

            case 1: // Rechercher du contenu avec des critères (titre et/ou type)
                let SQL = "SELECT idContenu, titre, description, type, imagePrincContenu, specificData FROM Contenu WHERE ";
                let whereClauses = [];
                let values: any[] = [];

                if (params.titre) {
                    whereClauses.push("UPPER(titre) LIKE UPPER(?)");
                    values.push(`%${params.titre}%`);
                }
                if (params.type) {
                    whereClauses.push("type = ?");
                    values.push(params.type);
                }

                if (whereClauses.length === 0) {
                    SQL = "SELECT idContenu, titre, description, type, imagePrincContenu, specificData FROM Contenu";
                } else {
                    SQL += whereClauses.join(" AND ");
                }

                // console.log("Executing SQL query:", SQL, values);

                const [results] = await connection.execute(SQL, values);
                await connection.end();
                return res.status(200).json(results);

            default: // Récupérer tout le contenu
                const [allContent] = await connection.execute("SELECT * FROM Contenu");
                await connection.end();
                return res.status(200).json(allContent);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
}
