interface Composant {
    texts: string[];
    imgs: number[];
}

export default function Composant1({ texts, imgs }: Composant) {
    return (
        <div className={"w-screen h-screen"}>
            <img src={`/images/${imgs[0]}`} alt={imgs[0].toString()} className={"z-0 w-screen h-screen"}/>

            <div className={"z-10 w-screen h-screen"}>
                <div className={"text-white p-10"}>
                    <h1>{texts[0]}</h1>
                    <p>{texts[1]}</p>
                </div>
            </div>
        </div>
    );
}