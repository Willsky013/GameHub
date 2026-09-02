// ArcadeGameCard
// - Small UI card shown on the arcade cabinet screen; shows either the game artwork or high score info
import type { Game } from "../../services/gameService";
import type { GameScore, Score } from "../../services/scoreService";
import "./css/ArcadeGameCard.css";

type ArcadeGameCardProps = {
    game: Game;
    showHighScore: boolean;
    highScore: GameScore | null;
    myHighScore: Score | null;
    myDisplayName?: string;
    isLoggedIn: boolean;
};

export default function ArcadeGameCard({
    game,
    showHighScore,
    highScore,
    myHighScore,
    myDisplayName,
    isLoggedIn,
}: ArcadeGameCardProps) {
    if (showHighScore) {
        return (
            <div className="arcadeHighScore">

                <div className="arcadeTopScore">
                    <span>Top Highscore</span>

                    {highScore ? (
                        <>
                            <strong>
                                {highScore.displayName}
                            </strong>

                            <strong>
                                {highScore.scoreValue}
                            </strong>
                        </>
                    ) : (
                        <span>No score yet</span>
                    )}
                </div>

                <div className="arcadeMyScore">
                    <span>Your HighScore</span>

                    {!isLoggedIn ? (
                        <span>Log in to save scores</span>
                    ) : myHighScore ? (
                        <>
                            <strong>
                                {myDisplayName}
                            </strong>

                            <strong>
                                {myHighScore.scoreValue}
                            </strong>
                        </>
                    ) : (
                        <span>No score yet</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="arcadeGameScreen">
            {game.image ? (
                <img
                    src={game.image}
                    alt={game.name}
                    className="arcadeGameImage"
                />
            ) : (
                <div className="arcadeGamePlaceholder">
                    {game.name}
                </div>
            )}
        </div>
    );
}