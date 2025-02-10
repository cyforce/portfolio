import Composant1 from "@/components/composants/1";
import Composant2 from "@/components/composants/2";
import Composant3 from "@/components/composants/3";

interface Image {
    idImage: number;
    url: string;
    alt: string;
}

interface ComposantData {
    type: number;
    texts: string[];
    imgs: Image[];
}

interface ShowContentsPageProps {
    comps: ComposantData[]; // Déclare la prop comme un tableau de ComposantData
}

const ShowContentsPage: React.FC<ShowContentsPageProps> = ({ comps }) => {
    return (
        <div>
            {comps.map((composant, index) => {
                switch (composant.type) {
                    case 1:
                        return <Composant1 key={index} texts={composant.texts} imgs={composant.imgs} />;
                    case 2:
                        return <Composant2 key={index} texts={composant.texts} imgs={composant.imgs} />;
                    case 3:
                        return <Composant3 key={index} texts={composant.texts} imgs={composant.imgs} />;
                    default:
                        return <div key={index}>Composant inconnu</div>;
                }
            })}
        </div>
    );
};

export default ShowContentsPage;
