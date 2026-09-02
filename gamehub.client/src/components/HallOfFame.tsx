import { useEffect, useState } from "react";
import {
    getGames,
    type Game,
} from "../services/gameService";
import {
    getGameScores,
    type GameScore,
} from "../services/scoreService";
import "../css/HallOfFame.css";

type HallOfFameEntry = {
    game: Game;
    score: GameScore | null;
};

function getTimeAgo(dateString: string) {
    const createdAt = new Date(dateString);
    const now = new Date();

    const difference = now.getTime() - createdAt.getTime();

    const minutes = Math.floor(
        difference / (1000 * 60)
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
        return "1 day ago";
    }

    return `${days} days ago`;
}

// HallOfFame
// - Shows top score per game in a compact list by fetching games and their top score
export default function HallOfFame() {
    const [entries, setEntries] = useState<HallOfFameEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadHallOfFame() {
            try {
                const games = await getGames();

                const entries = await Promise.all(
                    games.map(async (game) => {
                        const scores = await getGameScores(
                            game.id,
                            1
                        );

                        return {
                            game,
                            score: scores[0] ?? null,
                        };
                    })
                );

                setEntries(entries);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load Hall of Fame"
                );
            } finally {
                setLoading(false);
            }
        }

        loadHallOfFame();
    }, []);

    if (loading) {
        return (
            <section className="hallOfFame">
                <h2>Hall of Fame</h2>
                <p>Loading...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="hallOfFame">
                <h2>🏆 Hall of Fame 🏆</h2>
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className="hallOfFame">
            <h2>🏆 Hall of Fame 🏆</h2>

            <div className="hallOfFameList">
                {entries.map((entry) => (
                    <div
                        className="hallOfFameGame"
                        key={entry.game.id}
                    >
                        <h3>{entry.game.name}</h3>

                        {entry.score ? (
                            <div className="hallOfFameScore">
                                <span className="hallOfFamePlayer">
                                    {entry.score.displayName}
                                </span>

                                <strong className="hallOfFamePoints">
                                    {entry.score.scoreValue}
                                </strong>

                                <span className="hallOfFameTime">
                                    {getTimeAgo(
                                        entry.score.createdAt
                                    )}
                                </span>
                            </div>
                        ) : (
                            <p>No score yet.</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}