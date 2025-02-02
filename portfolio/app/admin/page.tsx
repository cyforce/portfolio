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
        <div className={"flex items-center justify-center w-screen h-[calc(100vh-3.45rem)]"}>
            <div className="flex-grow flex flex-col items-center justify-center bg-none text-white">
                <h1 className="text-3xl">Bienvenue, {session?.user?.name} !</h1>
                <button onClick={()=>router.push("/admin/images")} className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-400 rounded">
                    Gérer les images
                </button>
                <button onClick={()=>router.push("/admin/contenu")} className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-400 rounded">
                    Gérer le contenu
                </button>
                <button onClick={()=>router.push("/admin/users")} className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded">
                    Gérer les utilisateur
                </button>
                <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 rounded">
                    Se déconnecter
                </button>
            </div>
        </div>
    );
}
