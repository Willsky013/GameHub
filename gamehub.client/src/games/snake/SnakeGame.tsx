import { useEffect, useRef, useState } from "react";
import type { Direction } from "./Snake";
import { Game } from "./Game";
import { saveScore } from "../../services/scoreService";
import type { GameComponentProps } from "../GameRegistry";
import "./Snake.css";

import SnakeRenderer from "./SnakeRenderer";

// SnakeGame component
// - Renders the game UI and manages component state (game instance, started flag, saved scores)
// - Handles keyboard input for movement and runs the main game loop via setInterval
// - Submits score to the server when the game ends
export default function SnakeGame({
    gameId,
    onScoreSaved,
}: GameComponentProps) {
    // Local component state
    // - game: the current game instance (contains snake, food, score, etc.)
    const [game, setGame] = useState(() => new Game());
    // - started: whether the game loop has been started
    const [started, setStarted] = useState(false);

    // - scoreSavedRef: ref to ensure we submit the score only once per game over
    const scoreSavedRef = useRef(false);
    // - savedHighScore: high score returned by the server after submitting
    const [savedHighScore, setSavedHighScore] = useState<number | null>(null);

    useEffect(() => {
        // Keyboard handler: converts key presses into snake direction changes
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            let direction: Direction | null = null;

            switch (event.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    direction = "up";
                    break;

                case "ArrowDown":
                case "s":
                case "S":
                    direction = "down";
                    break;

                case "ArrowLeft":
                case "a":
                case "A":
                    direction = "left";
                    break;

                case "ArrowRight":
                case "d":
                case "D":
                    direction = "right";
                    break;
            }

            if (!direction) {
                return;
            }

            event.preventDefault();

            setStarted(true);

            setGame((currentGame) => {
                const newGame = currentGame.clone();

                newGame.snake.setDirection(direction);

                return newGame;
            });
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!started) {
            return;
        }

        const gameLoop = setInterval(() => {
            setGame((currentGame) => {
                const newGame = currentGame.clone();

                newGame.move();

                return newGame;
            });
        }, game.moveSpeed);

        return () => {
            clearInterval(gameLoop);
        };
    }, [started, game.moveSpeed]);

    useEffect(() => {
        if (!game.gameOver || scoreSavedRef.current) {
            return;
        }

        scoreSavedRef.current = true;

        async function submitScore() {
            try {
                const result = await saveScore(
                    gameId,
                    game.score
                );

                setSavedHighScore(result.highScore);

                onScoreSaved();

                console.log("Score saved:", result);
            } catch (error) {
                console.error("Could not save score:", error);
            }
        }

        submitScore();
    }, [
        game.gameOver,
        game.score,
        gameId,
        onScoreSaved,
    ]);

    return (
        <div className="snakeGame">

            <div className="snakeBoardContainer">

                <SnakeRenderer
                    snake={game.snake}
                    food={game.food}
                />

                {game.gameOver && (
                    <div className="gameOverOverlay">

                        <h2>GAME OVER</h2>

                        <p>FINAL SCORE</p>

                        <strong>{game.score}</strong>

                        {savedHighScore !== null && (
                            <p>
                                HIGH SCORE: {savedHighScore}
                            </p>
                        )}

                        <button
                            onClick={() => {
                                setGame(new Game());
                                setStarted(false);
                                scoreSavedRef.current = false;
                                setSavedHighScore(null);
                            }}
                        >
                            RESTART
                        </button>

                    </div>
                )}

            </div>

            <p className="snakeScore">
                SCORE: {game.score}
            </p>

        </div>
    );
}