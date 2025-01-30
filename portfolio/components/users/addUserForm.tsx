import { useState } from "react";

export default function AddUserForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/users/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role }),
            });
            if (res.ok) {
                setMessage("Utilisateur ajouté !");
                setMessageType("success");
            } else {
                setMessage("Erreur lors de l'ajout de l'utilisateur.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            setMessage("Erreur lors de l'ajout de l'utilisateur.");
            setMessageType("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-700 rounded bg-gray-800 bg-opacity-50 text-white">
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-700 p-2 mb-2 w-full bg-gray-900 text-white"
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-700 p-2 mb-2 w-full bg-gray-900 text-white"
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-700 p-2 mb-2 w-full bg-gray-900 text-white"
            >
                <option value="user">Utilisateur</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" className="bg-green-500 px-4 py-2 text-white rounded w-full">Ajouter</button>
            {message && (
                <p className={`mt-2 text-center ${messageType === "success" ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
