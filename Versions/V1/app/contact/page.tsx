// app/contact/page.tsx
"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [subject, setSubject] = useState(""); // État pour le sujet
  const [message, setMessage] = useState(""); // État pour le message
  const [status, setStatus] = useState(""); // État pour le message de statut

  // Fonction pour envoyer l'email via mailto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Construction de l'URL mailto
    const mailtoUrl = `mailto:celian.touzeau@outlook.fr?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    // Redirection vers l'URL mailto
    window.location.href = mailtoUrl;

    // Mise à jour du statut
    setStatus("Votre message a été ouvert dans votre client de messagerie.");
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-5rem)] overflow-auto"> {/* Ajustez la hauteur en fonction de la navbar */}
      <div className="p-8 max-w-lg w-full bg-opacity-20 bg-black backdrop-blur-md rounded-lg shadow-lg border border-gray-700 overflow-auto max-h-[90vh]">
        <h2 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-lg">Contactez-moi</h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet"
            className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
            style={{ minHeight: '100px' }}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
          >
            Envoyer
          </button>
        </form>
        {status && <p className="mt-4 text-center text-white">{status}</p>}
      </div>
    </div>
  );
}
