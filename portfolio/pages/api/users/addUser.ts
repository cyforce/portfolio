import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    let connection;

    try {
        // Hachage du mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds

        // Connexion à la base de données
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        // Exécution de la requête d'insertion
        const [result] = await connection.execute<ResultSetHeader>(
            "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)",
            [username, hashedPassword, role]
        );

        // Vérification que l'utilisateur a bien été inséré
        if (result.affectedRows === 0) {
            throw new Error("Échec de l'insertion de l'utilisateur.");
        }

        res.status(201).json({ message: 'Utilisateur ajouté avec succès.' });

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        res.status(500).json({ error: 'Impossible d’ajouter l’utilisateur.' });
    } finally {
        if (connection) {
            await connection.end(); // Fermeture propre de la connexion
        }
    }
}
