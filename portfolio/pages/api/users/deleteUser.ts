import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

interface DeleteResult {
    affectedRows: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Missing user ID' });
        }

        try {
            // Créer une connexion à la base de données
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            });

            // Exécution de la requête de suppression dans la base de données
            const [result] = await connection.execute(
                "DELETE FROM Users WHERE idUser = ?",
                [id]
            );

            // Fermer la connexion
            await connection.end();

            if ((result as DeleteResult).affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: 'Unable to delete user' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
