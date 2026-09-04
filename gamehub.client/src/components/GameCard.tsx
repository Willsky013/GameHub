// GameCard
// - Small clickable card for a game in the library that links to the game's page
import { Link } from "react-router-dom";
import "../css/GameCard.css";
import GameCartridges from "../assets/GameCartridges.png";

type GameCardProps = {
    id: string;
    title: string;
    image: string;
};

export default function GameCard({
    id,
    title,
    image,
}: GameCardProps) {
    return (
        <Link
            to={`/game/${id}`}
            className="gameCard"
        >
            {/* Cartridge */}
            <img
                src={GameCartridges}
                alt=""
                className="gameCardCartridge"
            />

            {/* Game name */}
            <div className="gameCardTitle">
                {title}
            </div>

            {/* Game artwork */}
            {image && (
                <img
                    src={`${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`}
                    alt={title}
                    className="gameCardGameImage"
                />
            )}
        </Link>
    );
}