import { useEffect, useState } from "react";
import {
    getGameScores,
    getScores,
    type GameScore,
    type Score,
} from "../services/scoreService";
import { useAuth } from "../hooks/useAuth";
import "../css/Leaderboard.css";

type LeaderboardProps = {
    gameId: number;
    refreshTrigger: number;
};

// Leaderboard
// - Shows top scores for a game and the current user's best scores when logged in
export default function Leaderboard({
    gameId,
    refreshTrigger,
}: LeaderboardProps) {
    const { isLoggedIn } = useAuth();

    const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);
    const [myScores, setMyScores] = useState<Score[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load leaderboard and personal scores when gameId, isLoggedIn, or refreshTrigger changes
    useEffect(() => {
        async function loadScores() {
            setLoading(true);
            setError("");

            try {
                const topScores = await getGameScores(gameId, 10);

                setLeaderboard(topScores);

                if (isLoggedIn) {
                    const personalScores = await getScores(gameId,3);

                    setMyScores(personalScores);
                } else {
                    setMyScores([]);
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load leaderboard"
                );
            } finally {
                setLoading(false);
            }
        }

        loadScores();
    }, [gameId, isLoggedIn, refreshTrigger]);

    if (loading) {
        return <p>Loading leaderboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>

            {leaderboard.length === 0 ? (
                <p>No scores yet.</p>
            ) : (
                <div className="leaderboardList">
                    {leaderboard.map((entry, index) => (
                        <div
                            className="leaderboardRow"
                            key={`${entry.displayName}-${entry.createdAt}-${index}`}
                        >
                            <span className="leaderboardRank">
                                {index + 1}
                            </span>

                            <span className="leaderboardName">
                                {entry.displayName || "Unknown"}
                            </span>

                            <span className="leaderboardScore">
                                {entry.scoreValue}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            

            <div className="myScores">
                <h2>Your Best Scores</h2>

                {isLoggedIn && (
                    <div>
                        {myScores.length === 0 ? (
                            <p>You haven't played this game yet.</p>
                        ) : (
                            <div className="leaderboardList">
                                {myScores.map((score, index) => (
                                    <div
                                        className="leaderboardRow"
                                        key={`${score.createdAt}-${index}`}
                                    >
                                        <span className="leaderboardRank">
                                            {index + 1}
                                        </span>

                                        <span className="leaderboardName">
                                            Your Score
                                        </span>

                                        <span className="leaderboardScore">
                                            {score.scoreValue}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {!isLoggedIn && (
                    <p>Login to see your scores and to save new once!</p>
                )}
                    
            </div>
        </div>
    );
}