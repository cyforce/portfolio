interface Composant {
    textes: string;
    images: string;
}

export default function Composant({ textes, images }: Composant) {
    let imagesJSON = JSON.parse(images);
    let textesJSON = JSON.parse(textes);

    return (
        <div className={"w-screen h-screen"}>
            <img src={`/images/${imagesJSON[0].url}`} alt={imagesJSON[0].url} className={"z-0 w-screen h-screen"}/>

            <div className={"z-10 absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50"}>
                <div className={"text-white p-10"}>
                    <h1>{textesJSON[0]}</h1>
                    <p>{textesJSON[1]}</p>
                </div>
            </div>
        </div>
    );
}