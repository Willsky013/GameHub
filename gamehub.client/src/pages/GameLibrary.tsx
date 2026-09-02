// GameLibrary
// - Lists available games fetched from the API and shows them as GameCard components
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { getGames, type Game } from "../services/gameService";
import "../css/GameLibrary.css";

export default function GameLibrary() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await getGames();
                setGames(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load games"
                );
            } finally {
                setLoading(false);
            }
        }

        loadGames();
    }, []);

    if (loading) {
        return <p>Loading games...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main className="gameLibrary">
            <h1>Game Library</h1>

            <div className="gameGrid">
                {games.map((game) => (
                    <GameCard
                        key={game.id}
                        id={game.slug}
                        title={game.name}
                        image={game.image ?? ""}
                    />
                ))}
            </div>
        </main>
    );
}
