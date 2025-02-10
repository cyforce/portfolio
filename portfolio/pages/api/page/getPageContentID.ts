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

        if (!params.idPage) {
            await connection.end();
            return res.status(400).json({ error: "L'ID du contenu est requis." });
        }

        const idPage = parseInt(params.idPage);

        const [content] = await connection.execute<RowDataPacket[]>(
            "SELECT Contenu FROM AssociationsPageContenu WHERE Page = ?",
            [idPage]
        );

        if (content.length === 0) {
            await connection.end();
            return res.status(404).json({ error: "Contenu non trouvé." });
        }

        await connection.end();

        return res.status(200).json(content);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: "Une erreur est survenue lors de la connexion à la base de données." });
    }
}