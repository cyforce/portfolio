// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: [
      {
        title: 'Projet 1',
        description: 'Description du projet 1.',
        category: 'Personnel',
        imageUrl: 'https://via.placeholder.com/300',
      },
      {
        title: 'Projet 2',
        description: 'Description du projet 2.',
        category: 'Professionnel',
        imageUrl: 'https://via.placeholder.com/300',
      },
      // Ajoute d'autres projets ici...
    ],
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
