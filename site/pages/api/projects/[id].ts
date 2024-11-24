// pages/api/projects/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  console.log('ID reçu :', id); // Ajout d'un log pour débogage

  const projectId = Number(id);
  if (isNaN(projectId)) {
    console.log(`ID invalide : ${id}`);
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      console.log(`Projet avec ID ${id} non trouvé`);
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.json(project);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
