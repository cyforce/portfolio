import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';

export const config = {
    api: {
        bodyParser: false, // Désactive le bodyParser pour gérer les fichiers correctement
    },
};

// Fonction pour parser la requête avec formidable
const parseForm = async (req: NextApiRequest): Promise<{ files: formidable.Files }> => {
    const form = formidable(); // ✅ Nouvelle syntaxe

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { files } = await parseForm(req);
        const file = files.image as File | File[] | undefined;

        if (!file || (Array.isArray(file) && file.length === 0)) {
            return res.status(400).json({ error: 'Aucun fichier reçu' });
        }

        const uploadedFile = Array.isArray(file) ? file[0] : file;

        if (!uploadedFile.originalFilename) {
            return res.status(400).json({ error: 'Nom de fichier invalide' });
        }

        // Génération d'un nom unique
        const newFileName = `${uuidv4()}${path.extname(uploadedFile.originalFilename)}`;
        const newFilePath = path.join(process.cwd(), 'public', 'images', newFileName);

        // Copie du fichier (au lieu de renameSync)
        fs.copyFileSync(uploadedFile.filepath, newFilePath);
        fs.unlinkSync(uploadedFile.filepath); // Supprime le fichier temporaire

        // Connexion à MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        // Insertion de l'image en base de données
        await connection.execute("INSERT INTO Image (url) VALUES (?)", [newFileName]);
        await connection.end();

        res.status(200).json({ message: 'Image ajoutée avec succès', fileName: newFileName });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l’image :", error);
        res.status(500).json({ error: 'Impossible d’ajouter l’image' });
    }
}
