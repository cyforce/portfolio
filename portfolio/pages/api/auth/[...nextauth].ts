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
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_NAME,
                    });

                    // Vérifie si l'utilisateur existe
                    const [rows] = await db.execute(
                        "SELECT id, username, password, role FROM user WHERE username = ?",
                        [credentials.username]
                    );

                    await db.end(); // Ferme la connexion

                    if (Array.isArray(rows) && rows.length > 0) {
                        const user = rows[0] as { id: string; username: string; password: string; role: string };

                        // Vérifie le mot de passe avec bcrypt
                        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                        if (!passwordMatch) {
                            throw new Error("Mot de passe incorrect");
                        }

                        return { id: user.id, name: user.username, role: user.role };
                    } else {
                        throw new Error("Utilisateur introuvable");
                    }
                } catch (error) {
                    throw new Error("Erreur serveur lors de l'authentification");
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
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
