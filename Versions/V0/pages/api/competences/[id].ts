// pages/api/projects/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  console.log('ID reçu :', id); // Ajout d'un log pour débogage

  const competenceId = Number(id);
  if (isNaN(competenceId)) {
    console.log(`ID invalide : ${id}`);
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      include: { projects: true }, // Inclure les projets liés
    });

    if (!competence) {
      console.log(`Compétence avec ID ${id} non trouvée`);
      return res.status(404).json({ error: 'Compétence non trouvée' });
    }

    res.json(competence);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
