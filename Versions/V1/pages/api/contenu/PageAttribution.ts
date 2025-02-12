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
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Méthode non autorisée'});
    }

    const params = req.body;

    if (params.action === undefined) {
        return res.status(400).json({error: "L'action est requise."});
    }

    try {
        const connection = await connect();

        switch (params.action) {
            case 0: // modif de lien page-contenu
                if (!params.pageID || !params.contenuID) {
                    return res.status(400).json({error: 'Tous les champs sont requis pour la création.'});
                }

                const createResult = await connection.execute(
                    `UPDATE AssociationsPageContenu SET Contenu = ? WHERE Page = ?`,
                    [params.contenuID, params.pageID]
                );

                await connection.end();
                return res.status(201).json({message: "Page liée avec succès.", result: createResult});

            case 1: // récupération du contenu liée à une page
                if(!params.pageID) {
                    return res.status(400).json({error: 'Tous les champs sont requis pour la récupération.'});
                }

                const readResult = await connection.execute(
                    `SELECT Contenu FROM AssociationsPageContenu WHERE Page = ?`,
                    [params.pageID]
                );

                await connection.end();

                return res.status(200).json({message: "Contenu récupéré avec succès.", result: readResult[0]});
            case 2: // récup tout
                const readAllResult = await connection.execute(
                    `SELECT * FROM AssociationsPageContenu`
                );

                await connection.end();

                return res.status(200).json({message: "Contenu récupéré avec succès.", result: readAllResult[0]});
            case 3: // update tout
                /*
                    prend en paramètre un objet contenant les pages et les contenus à mettre à jour sous la forme :
                    {
                        "contenus": {
                            "pageID": contenuID,
                            ...
                        },
                    }
                */

                if (!params.contenus || typeof params.contenus !== "object") {
                    return res.status(400).json({ error: "Tous les champs sont requis pour la mise à jour." });
                }

                console.log("Pages à mettre à jour :", params.contenus);

                try {
                    const updatePromises = Object.entries(params.contenus).map(([pageID, contenuID]) => {
                        return connection.execute(
                            `UPDATE AssociationsPageContenu SET Contenu = ? WHERE Page = ?`,
                            [contenuID, pageID]
                        );
                    });

                    await Promise.all(updatePromises); // Exécute toutes les requêtes en parallèle

                    await connection.end();
                    return res.status(200).json({ message: "Pages mises à jour avec succès." });
                } catch (error) {
                    console.error("Erreur lors de la mise à jour des pages :", error);
                    return res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
                }
            default:
                return res.status(400).json({error: "Action non reconnue."});

        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion à la base de données:", error);
        return res.status(500).json({error: "Une erreur s'est produite lors de la connexion à la base de données."});
    }
}