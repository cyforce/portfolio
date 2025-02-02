import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Créer une connexion à la base de données
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            });

            // Récupérer les images de la base de données
            const [rows] = await connection.execute(
                "SELECT idImage, url FROM Image"
            );

            // Fermer la connexion
            await connection.end();

            res.status(200).json(rows);
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ error: 'Unable to fetch images' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
