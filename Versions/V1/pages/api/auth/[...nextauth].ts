import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Votre nom d'utilisateur" },
                password: { label: "Password", type: "password", placeholder: "Votre mot de passe" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Nom d'utilisateur et mot de passe requis");
                }

                try {
                    // Connexion sécurisée à la base de données
                    const db = await mysql.createConnection({
                        host: process.env.DB_HOST,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASS,
                        database: process.env.DB_NAME,
                    });

                    // console.log("Connexion à la base de données établie");

                    // Vérifie si l'utilisateur existe
                    const [rows] = await db.execute(
                        "SELECT * FROM Users WHERE username = ?",
                        [credentials.username]
                    );

                    // console.log("Résultat de la requête de base de données:", rows);

                    await db.end(); // Ferme la connexion

                    if (Array.isArray(rows) && rows.length > 0) {
                        const user = rows[0] as { idUser: string; username: string; password: string; role: string };

                        // Vérifie le mot de passe avec bcrypt
                        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                        console.log("Mot de passe correspond:", passwordMatch);

                        if (!passwordMatch) {
                            throw new Error("Mot de passe incorrect");
                        }

                        return { id: user.idUser, name: user.username, role: user.role };
                    } else {
                        throw new Error("Utilisateur introuvable");
                    }
                } catch (error) {
                    console.error("Erreur lors de l'authentification:", error);
                    throw new Error("Erreur serveur lors de l'authentification");
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            // console.log("Session callback - Token:", token);
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            // console.log("JWT callback - User:", user);
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
    },
    pages: {
        signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
});
