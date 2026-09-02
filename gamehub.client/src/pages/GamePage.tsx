// GamePage
// - Loads a game's metadata and renders the selected game component along with leaderboard
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../css/GamePage.css";

import Leaderboard from "../components/Leaderboard";
import { GameRegistry } from "../games/GameRegistry";
import { getGameBySlug, type Game } from "../services/gameService";

export default function GamePage() {
    const { slug } = useParams<{ slug: string }>();

    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);

    const handleScoreSaved = useCallback(() => {
        setLeaderboardRefresh((value) => value + 1);
    }, []);

    // Load game metadata when the component mounts or when the slug changes
    useEffect(() => {
        async function loadGame() {
            if (!slug) {
                setError("Game not found");
                setLoading(false);
                return;
            }

            try {
                const data = await getGameBySlug(slug);

                setGame(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Game not found"
                );
            } finally {
                setLoading(false);
            }
        }

        loadGame();
    }, [slug]);

    if (loading) {
        return <p>Loading game...</p>;
    }

    if (error || !game) {
        return <p>{error || "Game not found"}</p>;
    }

    const gameDefinition = GameRegistry[game.slug];

    if (!gameDefinition) {
        return <h1>Game not implemented yet</h1>;
    }

    const GameComponent = gameDefinition.component;

    return (
        <main className="gamePage">
            <section className="gameDetails">
                <h1>{game.name}</h1>

                <p>{game.description}</p>

                <div className="gameControls">
                    <h2>Controls</h2>

                    {gameDefinition.controls.map((control) => (
                        <div
                            key={control.key}
                            className="controlRow"
                        >
                            <span className="controlKey">
                                {control.key}
                            </span>

                            <span className="controlAction">
                                {control.action}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="game">
                <GameComponent
                    gameId={game.id}
                    onScoreSaved={handleScoreSaved}
                />
            </section>

            <aside className="leaderboard">
                <Leaderboard
                    gameId={game.id}
                    refreshTrigger={leaderboardRefresh}
                />
            </aside>
        </main>
    );
}