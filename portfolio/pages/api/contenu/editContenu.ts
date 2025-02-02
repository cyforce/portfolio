import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

async function connect() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Méthode non autorisée. Utilisez GET.' });
    }

    const params = req.body;

    if (!params.action) {
        return res.status(400).json({ error: "L'action est requise." });
    }

    try {
        const connection = await connect();

        switch (params.action) {
            case '0': // Créer une page
                if (!params.titre || !params.description || !params.type || !params.imagePrincContenu || !params.page) {
                    return res.status(400).json({ error: 'Tous les champs sont requis pour la création.' });
                }

                const createResult = await connection.execute(
                    `INSERT INTO Contenu (titre, description, type, imagePrincContenu, page) VALUES (?, ?, ?, ?, ?)`,
                    [params.titre, params.description, params.type, params.imagePrincContenu, params.page]
                );

                await connection.end();
                return res.status(201).json({ message: "Page créée avec succès.", result: createResult });

            case '1': // Modifier une page
                if (!params.idContenu) {
                    return res.status(400).json({ error: "L'ID du contenu est requis pour la modification." });
                }

                let SQL = "UPDATE Contenu SET ";
                let edits: any[] = [];

                if (params.titre) {
                    SQL += "titre = ?, ";
                    edits.push(params.titre);
                }
                if (params.description) {
                    SQL += "description = ?, ";
                    edits.push(params.description);
                }
                if (params.type) {
                    SQL += "type = ?, ";
                    edits.push(params.type);
                }
                if (params.imagePrincContenu) {
                    SQL += "imagePrincContenu = ?, ";
                    edits.push(params.imagePrincContenu);
                }
                if (params.page) {
                    SQL += "page = ?, ";
                    edits.push(params.page);
                }

                if (edits.length === 0) {
                    await connection.end();
                    return res.status(400).json({ error: "Aucune modification fournie." });
                }

                SQL = SQL.slice(0, -2) + " WHERE idContenu = ?";
                edits.push(params.idContenu);

                const updateResult = await connection.execute(SQL, edits);
                await connection.end();
                return res.status(200).json({ message: "Page mise à jour avec succès.", result: updateResult });

            case '2': // Supprimer une page
                if (!params.idContenu) {
                    return res.status(400).json({ error: "L'ID du contenu est requis pour la suppression." });
                }

                const deleteResult = await connection.execute(
                    `DELETE FROM Contenu WHERE idContenu = ?`,
                    [params.idContenu]
                );

                await connection.end();
                return res.status(200).json({ message: "Page supprimée avec succès.", result: deleteResult });

            default:
                await connection.end();
                return res.status(400).json({ error: "Action non reconnue." });
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête :", error);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
}
