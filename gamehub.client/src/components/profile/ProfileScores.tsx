import { useEffect, useState } from "react";
import { getGames, type Game } from "../../services/gameService";
import { getScores, type Score } from "../../services/scoreService";
import { useAuth } from "../../hooks/useAuth";
import "./css/ProfileScores.css";

export default function ProfileScores() {
    const { user } = useAuth();

    const [games, setGames] = useState<Game[]>([]);
    const [scores, setScores] = useState<Score[]>([]);

    const [selectedGameId, setSelectedGameId] =
        useState<number | undefined>(undefined);

    const [scoreLimit, setScoreLimit] = useState(10);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await getGames();
                setGames(data);
            } catch (error) {
                console.error(
                    "Failed to load games:",
                    error
                );
            }
        }

        loadGames();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        async function loadScores() {
            setLoading(true);
            setError("");

            try {
                const data = await getScores(
                    selectedGameId,
                    scoreLimit
                );

                setScores(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load scores."
                );
            } finally {
                setLoading(false);
            }
        }

        loadScores();
    }, [user, selectedGameId, scoreLimit]);

    return (
        <section className="profileScores">
            <h2>Your High Scores</h2>

            <div className="scoreFilters">
                <div className="scoreFilter">
                    <label htmlFor="scoreGame">
                        Game
                    </label>

                    <select
                        id="scoreGame"
                        value={selectedGameId ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;

                            setSelectedGameId(
                                value === ""
                                    ? undefined
                                    : Number(value)
                            );
                        }}
                    >
                        <option value="">
                            All Games
                        </option>

                        {games.map((game) => (
                            <option
                                key={game.id}
                                value={game.id}
                            >
                                {game.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="scoreFilter">
                    <label htmlFor="scoreLimit">
                        Scores
                    </label>

                    <select
                        id="scoreLimit"
                        value={scoreLimit}
                        onChange={(event) =>
                            setScoreLimit(
                                Number(event.target.value)
                            )
                        }
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="0">All</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Loading scores...</p>
            ) : error ? (
                <p>{error}</p>
            ) : scores.length === 0 ? (
                <p>You haven't played any games yet.</p>
            ) : (
                <div className="profileScoreList">
                    {scores.map((score, index) => {
                        const game = games.find(
                            (game) =>
                                game.id === score.gameId
                        );

                        return (
                            <div
                                className="profileScoreRow"
                                key={`${score.gameId}-${score.createdAt}-${index}`}
                            >
                                <span>
                                    {index + 1}
                                </span>

                                <span>
                                    {game?.name ??
                                        "Unknown Game"}
                                </span>

                                <strong>
                                    {score.scoreValue}
                                </strong>

                                <span>
                                    {new Date(
                                        score.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}