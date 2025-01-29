import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

interface Image {
    idImage: number;
    url: string;
}

interface Composant {
    idComposant: number;
    type: number;
    textes: string; // JSON string
    images: string; // JSON string
}

interface Competence {
    idCompetence: number;
    titre: string;
    description: string;
    niveau: number;
    imagePrincCompetence: number; // ID de l'image principale
    pages: string; // JSON string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const mode = req.query.mode === 'minimal' ? 'minimal' : 'full';
            let ret = '{}';

            if(mode === 'full') {
                const competencesQuery = "SELECT * FROM Competence";
                const competences = await new Promise<Competence[]>((resolve, reject) => {
                    db.query(competencesQuery, (err, results) => {
                        if (err) reject(err);
                        else resolve(results as Competence[]);
                    });
                });

                ret = '{';
                ret += '"competences": [';

                for (const competence of competences) {
                    const imagePrinc = await new Promise<Image[]>((resolve, reject) => {
                        db.query(`SELECT * FROM Image WHERE idImage = ${competence.imagePrincCompetence}`, (err, results) => {
                            if (err) reject(err);
                            else resolve(results as Image[]);
                        });
                    });


                    const pages = JSON.parse(competence.pages || '[]');
                    const composants: Composant[] = [];
                    const images: Image[][] = [];

                    // Charger les composants pour chaque page
                    for (let i = 0; i < pages.length; i++) {
                        const composantsQuery = `SELECT *
                                 FROM Composant
                                 WHERE idComposant = ${pages[i]}`;
                        const composant = await new Promise<Composant[]>((resolve, reject) => {
                            db.query(composantsQuery, (err, results) => {
                                if (err) reject(err);
                                else resolve(results as Composant[]);
                            });
                        });

                        composants.push(composant[0]);

                        // Charger les images pour chaque composant
                        const composantImages: Image[] = [];
                        const composantImagesIds = JSON.parse(composant[0].images || '[]');

                        for (const idImage of composantImagesIds) {
                            const imagesQuery = `SELECT *
                                 FROM Image
                                 WHERE idImage = ${idImage}`;
                            const image = await new Promise<Image[]>((resolve, reject) => {
                                db.query(imagesQuery, (err, results) => {
                                    if (err) reject(err);
                                    else resolve(results as Image[]);
                                });
                            });

                            composantImages.push(image[0]);
                        }

                        images.push(composantImages);
                    }

                    // Ajouter la compétence et ses détails au JSON
                    ret += '{';
                    ret += `"idCompetence": ${competence.idCompetence},`;
                    ret += `"titre": "${competence.titre}",`;
                    ret += `"description": "${competence.description}",`;
                    ret += `"niveau": ${competence.niveau},`;
                    ret += `"imagePrincCompetence": {`;
                    ret += `"idImage": ${imagePrinc[0].idImage},`;
                    ret += `"url": "${imagePrinc[0].url}"`;
                    ret += `},`;
                    ret += `"pages": [`;

                    for (let i = 0; i < composants.length; i++) {
                        const composant = composants[i];
                        ret += '{';
                        ret += `"idComposant": ${composant.idComposant},`;
                        ret += `"textes": ${composant.textes},`;
                        ret += `"images": [`;

                        for (const image of images[i]) {
                            ret += '{';
                            ret += `"idImage": ${image.idImage},`;
                            ret += `"url": "${image.url}"`;
                            ret += '},';
                        }

                        // Supprimer la dernière virgule de la liste des images
                        if (images[i].length > 0) {
                            ret = ret.slice(0, -1);
                        }

                        ret += ']';
                        ret += '},';
                    }

                    // Supprimer la dernière virgule de la liste des composants
                    if (composants.length > 0) {
                        ret = ret.slice(0, -1);
                    }

                    ret += ']';
                    ret += '},';
                }

                // Supprimer la dernière virgule de la liste des compétences
                if (competences.length > 0) {
                    ret = ret.slice(0, -1);
                }

                ret += ']';
                ret += '}';

                console.log(ret);

            } else {
                const competencesQuery = "SELECT idCompetence, titre, description, imagePrincCompetence FROM Competence";

                const competences = await new Promise<Competence[]>((resolve, reject) => {
                    db.query(competencesQuery, (err, results) => {
                        if (err) reject(err);
                        else resolve(results as Competence[]);
                    });
                });

                ret = '{';
                ret += '"competences": [';

                for (const competence of competences) {
                    const imagePrinc = await new Promise<Image[]>((resolve, reject) => {
                        db.query(`SELECT * FROM Image WHERE idImage = ${competence.imagePrincCompetence}`, (err, results) => {
                            if (err) reject(err);
                            else resolve(results as Image[]);
                        });
                    });

                    ret += '{';
                    ret += `"idCompetence": ${competence.idCompetence},`;
                    ret += `"titre": "${competence.titre}",`;
                    ret += `"description": "${competence.description}",`;
                    ret += `"imagePrincCompetence": {`;
                    ret += `"idImage": ${imagePrinc[0].idImage},`;
                    ret += `"url": "${imagePrinc[0].url}"`;
                    ret += '}';
                    ret += '},';
                }

                // Supprimer la dernière virgule de la liste des compétences
                if (competences.length > 0) {
                    ret = ret.slice(0, -1);
                }

                ret += ']';
                ret += '}';

                console.log(ret);
            }

            // Renvoyer la réponse
            res.status(200).json(ret);
        } catch (error) {
            console.error('Erreur API:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    } else {
        // Méthode HTTP non autorisée
        res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
