"use client";

import { useEffect, useState } from "react";
import AddUserForm from "@/components/users/addUserForm";
import RmUserForm from "@/components/users/rmUserForm";
import UpdateUserForm from "@/components/users/updateUserForm";

interface User {
    idUser: number;
    username: string;
    role: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [selectedForm, setSelectedForm] = useState<"add" | "remove" | "modify" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users/getUsers");
            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await res.json();
            console.log("Data fetched from API:", data); // Ajoutez ce log pour le débogage
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                throw new Error("Invalid data format");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users. Please try again later.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-10 bg-gray-900 bg-opacity-75 text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Gestion des utilisateurs</h1>

            {/* Barre de recherche */}
            <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-700 p-2 rounded bg-gray-800 text-white w-full mb-4"
            />

            {/* Message d'erreur */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Bouton de rafraîchissement */}
            <button onClick={fetchUsers} className="bg-yellow-500 px-4 py-2 text-white rounded mb-4">
                Rafraîchir
            </button>

            {/* Liste des utilisateurs */}
            <ul className="border border-gray-700 p-4 rounded bg-gray-800 bg-opacity-50 max-h-96 overflow-y-auto">
                {Array.isArray(users) && users
                    .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
                    .map((user) => (
                        <li key={user.idUser} className="flex justify-between p-2 border-b border-gray-700">
                            <span>{user.idUser} : {user.username} ({user.role})</span>
                        </li>
                    ))}
            </ul>

            {/* Actions */}
            <div className="mt-4 flex justify-center space-x-4">
                <button onClick={() => setSelectedForm("add")} className="bg-green-500 px-4 py-2 text-white rounded">Ajouter</button>
                <button onClick={() => setSelectedForm("remove")} className="bg-red-500 px-4 py-2 text-white rounded">Supprimer</button>
                <button onClick={() => setSelectedForm("modify")} className="bg-blue-500 px-4 py-2 text-white rounded">Modifier</button>
            </div>

            {/* Formulaires dynamiques */}
            <div className="mt-8 flex justify-center">
                {selectedForm === "add" && <AddUserForm />}
                {selectedForm === "remove" && <RmUserForm />}
                {selectedForm === "modify" && <UpdateUserForm />}
            </div>
        </div>
    );
}
