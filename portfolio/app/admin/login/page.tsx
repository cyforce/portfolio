"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            ...credentials,
            redirect: false
        });

        if (res?.error) {
            setError("Identifiants incorrects !");
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-lg">
                <h2 className="text-2xl mb-4">Connexion Admin</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full p-2 mb-2 bg-gray-700 rounded"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full p-2 mb-2 bg-gray-700 rounded"
                />
                <button type="submit" className="w-full p-2 bg-cyan-500 hover:bg-cyan-400 rounded">
                    Se connecter
                </button>
            </form>
        </div>
    );
}
