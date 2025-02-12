import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt'; // Importation de bcryptjs

interface UpdateResult {
    affectedRows: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, password } = req.body;

        if (!id || !password) {
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

            // Exécution de la requête de mise à jour dans la base de données
            const [result] = await connection.execute(
                "UPDATE Users SET password = ? WHERE idUser = ?",
                [hashedPassword, id]
            );

            // Fermer la connexion
            await connection.end();

            if ((result as UpdateResult).affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: 'Unable to update user' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
