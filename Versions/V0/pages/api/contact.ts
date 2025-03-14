// pages/api/contact.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  name: 'mail.cyclonicforce.fr', // Utilisez un nom de domaine valide ici
  tls: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'celian.touzeau@outlook.fr', // Destinataire du message (peut être ton e-mail)
      subject: `Nouveau message de ${name} pour ${subject}`,
      text: message,
      html: `
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      headers: {
        'Reply-To': email as string,
        'Return-Path': process.env.SMTP_FROM as string,
      },
    });

    return res.status(200).json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
}
