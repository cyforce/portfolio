import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt'; // Importation de bcryptjs

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            // Hachage du mot de passe avec bcryptjs
            const hashedPassword = await bcrypt.hash(password, 10);  // 10 est le nombre de tours de hachage, ce qui est raisonnable

            // Créer une connexion à la base de données
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            });

            // Exécution de la requête d'insertion dans la base de données
            const [result] = await connection.execute(
                "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)",
                [username, hashedPassword, role]
            );

            // Fermer la connexion
            await connection.end();

            res.status(200).json({ message: 'User added successfully' });
        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).json({ error: 'Unable to add user' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
