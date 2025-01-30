import { useState } from "react";

export default function RmUserForm() {
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/deleteUser?id=${userId}`, { method: "DELETE" });
            if (res.ok) {
                setMessage("Utilisateur supprimé !");
                setMessageType("success");
            } else {
                setMessage("Erreur lors de la suppression de l'utilisateur.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage("Erreur lors de la suppression de l'utilisateur.");
            setMessageType("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-700 rounded bg-gray-800 bg-opacity-50 text-white">
            <input
                type="text"
                placeholder="ID de l'utilisateur"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border border-gray-700 p-2 mb-2 w-full bg-gray-900 text-white"
            />
            <button type="submit" className="bg-red-500 px-4 py-2 text-white rounded w-full">Supprimer</button>
            {message && (
                <p className={`mt-2 text-center ${messageType === "success" ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
