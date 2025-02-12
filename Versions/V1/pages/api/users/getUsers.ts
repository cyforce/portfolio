import { NextApiRequest, NextApiResponse } from 'next';
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        // Exécuter la requête SQL pour obtenir les utilisateurs
        const [rows] = await db.execute("SELECT * FROM Users");

        // Fermer la connexion
        await db.end();

        // Renvoi des utilisateurs au format JSON
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Unable to fetch users' });
    }
}
