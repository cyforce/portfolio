import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { idImage } = req.body;

    if (!idImage) {
        return res.status(400).json({ error: "ID de l'image requis" });
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        // Récupérer l'URL de l'image avant suppression
        const [rows] = await connection.execute<RowDataPacket[]>(
            "SELECT url FROM Image WHERE idImage = ?",
            [idImage]
        );

        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: "Image non trouvée" });
        }

        const imageUrl = rows[0].url;

        // Supprimer l'image de la base de données
        await connection.execute("DELETE FROM Image WHERE idImage = ?", [idImage]);
        await connection.end();

        // Supprimer l'image du dossier public/images
        const imagePath = path.join(process.cwd(), "public", "images", imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(200).json({ message: "Image supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error);
        res.status(500).json({ error: "Impossible de supprimer l'image" });
    }
}
