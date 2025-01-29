"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
    }, [status, router]);

    if (status === "loading") return <p>Chargement...</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl">Bienvenue, {session?.user?.name} !</h1>
            <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 rounded">
                Se déconnecter
            </button>
        </div>
    );
}
