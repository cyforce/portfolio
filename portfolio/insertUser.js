const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuration de la base de données
const dbConfig = {
    host: '100.126.1.57',
    user: 'portfolio',
    password: 'BsL.e.(HKUH-mSxg',
    database: 'portfolio'
};

// Fonction pour insérer un utilisateur
async function insertUser(username, password) {
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur dans la base de données
        const [result] = await connection.execute(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, 'user']
        );

        console.log(`Utilisateur inséré avec l'ID: ${result.insertId}`);
    } catch (error) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur:', error);
    } finally {
        await connection.end();
    }
}

// Exemple d'utilisation
const username = 'cyforce';
const password = 'zebi';

insertUser(username, password);
