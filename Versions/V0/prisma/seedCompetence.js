const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Vidage de la base de données...');
  await prisma.project.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.competence.deleteMany({});
  console.log('Base de données vidée avec succès.');

  const images = [
    { url: '/Images/placholder1.jpg' },
    { url: '/Images/placholder2.png' },
    { url: '/Images/placholder3.png' },
    { url: '/Images/placholder4.png' },
    { url: '/Images/placholder5.jpg' },
    { url: '/Images/placholder6.jpg' },
  ];

  console.log('Ajout des images...');
  const createdImages = [];
  for (const image of images) {
    const createdImage = await prisma.image.create({
      data: image,
    });
    createdImages.push(createdImage);
  }
  console.log('Images ajoutées avec succès.');

  console.log('Ajout des projets...');
  const project1 = await prisma.project.create({
    data: {
      title: 'Projet Exemple 1',
      description: 'Ceci est un exemple de projet 1.',
      category: 'Développement Web',
      imagePrincId: createdImages[0].id,
      templateId: 1,
      images: {
        connect: [{ id: createdImages[1].id }, { id: createdImages[2].id }],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Projet Exemple 2',
      description: 'Ceci est un exemple de projet 2.',
      category: 'Design',
      imagePrincId: createdImages[3].id,
      templateId: 2,
      images: {
        connect: [{ id: createdImages[4].id }, { id: createdImages[5].id }],
      },
    },
  });
  console.log('Projets ajoutés avec succès.');

  console.log('Ajout des compétences...');
  const competence1 = await prisma.competence.create({
    data: {
      name: 'JavaScript',
      description: 'Compétence en JavaScript.',
      level: 4,
      imagePrincId: createdImages[0].id,
      projects: {
        connect: [{ id: project1.id }],
      },
    },
  });

  const competence2 = await prisma.competence.create({
    data: {
      name: 'UI/UX Design',
      description: 'Compétence en conception UI/UX.',
      level: 5,
      imagePrincId: createdImages[3].id,
      projects: {
        connect: [{ id: project2.id }],
      },
    },
  });
  console.log('Compétences ajoutées avec succès.');

  console.log('Base de données initialisée avec succès.');
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation de la base de données:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
