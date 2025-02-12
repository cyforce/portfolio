"use client";

import {useParams} from "next/navigation";
import DisplayPage from "@/components/front/displayPage";

export default function Page() {
    const params = useParams<{ id: string }>() ?? { id: "" };

    return (
        <div>
            <a href={`/competences`} className={"absolute top-[3.95rem] left-2 p-2 bg-gray-800 hover:bg-gray-700 z-40"}>Retour</a>
            <DisplayPage pageID={parseInt(params.id)} mode={1} />
        </div>
    );
}