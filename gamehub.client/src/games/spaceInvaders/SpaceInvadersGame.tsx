// SpaceInvadersGame component
// - UI wrapper for the Space Invaders game
// - Manages keyboard input, game loop and score submission similar to SnakeGame
import { useEffect, useRef, useState } from "react";
import { saveScore } from "../../services/scoreService";
import type { GameComponentProps } from "../GameRegistry";
import {
    Game,
    GRID_HEIGHT,
    GRID_WIDTH,
} from "./Game";
import "./SpaceInvaders.css";

import Ailen from "./images/Alien.png"
import AilenAttack from "./images/Alien Attack.png"
import Copit from "./images/Copit.png"
import RightWing from "./images/Right Wing.png"
import LeftWing from "./images/Left Wing.png"
import PlayerAttack from "./images/Player Attack.png"

export default function SpaceInvadersGame({
    gameId,
    onScoreSaved,
}: GameComponentProps) {

    const [game, setGame] = useState(() => new Game());
    const gameIdRef = useRef(gameId);

    const scoreSavedRef = useRef(false);
    const [savedHighScore, setSavedHighScore] = useState<number | null>(null);

    const GAME_SPEED = 100;
    const PLAYER_BULLET_SPEED = 50;

    useEffect(() => {
        gameIdRef.current = gameId;
    }, [gameId]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            setGame((currentGame) => {
                const newGame = currentGame.clone();

                switch (event.key) {
                    case "ArrowLeft":
                    case "a":
                    case "A":
                        newGame.start();
                        newGame.movePlayerLeft();
                        break;

                    case "ArrowRight":
                    case "d":
                    case "D":
                        newGame.start();
                        newGame.movePlayerRight();
                        break;

                    case " ":
                        event.preventDefault();

                        newGame.start();
                        newGame.shoot();
                        break;

                    default:
                        return currentGame;
                }

                return newGame;
            });
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    useEffect(() => {
        if (!game.started || game.gameOver) {
            return;
        }

        const gameLoop = setInterval(() => {
            setGame((currentGame) => {
                const newGame = currentGame.clone();

                newGame.update();

                return newGame;
            });
        }, GAME_SPEED);

        return () => {
            clearInterval(gameLoop);
        };
    }, [game.started, game.gameOver]);
    useEffect(() => {
        const bulletLoop = setInterval(() => {
            setGame((currentGame) => {
                if (currentGame.bullet === null) {
                    return currentGame;
                }

                const newGame = currentGame.clone();

                newGame.moveBullet();

                return newGame;
            });
        }, PLAYER_BULLET_SPEED);

        return () => {
            clearInterval(bulletLoop);
        };
    }, []);

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
            } catch (error) {
                console.error(
                    "Could not save Space Invaders score:",
                    error
                );
            }
        }
        submitScore();
    }, [
        game.gameOver,
        game.score,
        gameId,
        onScoreSaved,
    ]);

    const cells = Array.from(
        {
            length:
                GRID_WIDTH * GRID_HEIGHT,
        },
        (_, index) => {
            const x = index % GRID_WIDTH;
            const y = Math.floor(
                index / GRID_WIDTH
            );

            const playerStart =
                game.player.position.x;

            const playerY =
                game.player.position.y;

            const isPlayer =
                y === playerY &&
                x >= playerStart &&
                x < playerStart + game.player.width;

            const isPlayerLeftWing =
                isPlayer &&
                x === playerStart;

            const isPlayerCenter =
                isPlayer &&
                x === playerStart + 1;

            const isPlayerRightWing =
                isPlayer &&
                x === playerStart + 2;

            const isBullet =
                game.bullet !== null &&
                game.bullet.position.x === x &&
                game.bullet.position.y === y;

            const isInvader =
                game.invaders.some(
                    (invader) =>
                        invader.alive &&
                        invader.position.x === x &&
                        invader.position.y === y
                );

            const isEnemyBullet = game.enemyBullets.some(
                (bullet) =>
                    bullet &&
                    bullet.position.x === x &&
                    bullet.position.y === y);

            return {
                index,
                isPlayerLeftWing,
                isPlayerCenter,
                isPlayerRightWing,
                isBullet,
                isInvader,
                isEnemyBullet,
            };
        }
    );

    return (
        <div className="spaceInvadersBoardContainer">

            <div
                className="spaceInvadersBoard"
                style={{
                    gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
                }}
            >
                {cells.map((cell) => (
                    <div
                        key={cell.index}
                        className="spaceCell"
                    >
                        {cell.isInvader && (
                            <img
                                src={Ailen}
                                alt=""
                                className="spaceSprite invaderSprite"
                            />
                        )}

                        {cell.isPlayerLeftWing && (
                            <img
                                src={LeftWing}
                                alt=""
                                className="spaceSprite playerSprite"
                            />
                        )}

                        {cell.isPlayerCenter && (
                            <img
                                src={Copit}
                                alt=""
                                className="spaceSprite playerSprite"
                            />
                        )}

                        {cell.isPlayerRightWing && (
                            <img
                                src={RightWing}
                                alt=""
                                className="spaceSprite playerSprite"
                            />
                        )}

                        {cell.isBullet && (
                            <img
                                src={PlayerAttack}
                                alt=""
                                className="spaceSprite bulletSprite"
                            />
                        )}

                        {cell.isEnemyBullet && (
                            <img
                                src={AilenAttack}
                                alt=""
                                className="spaceSprite enemyBulletSprite"
                            />
                        )}
                    </div>
                ))}

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
                                scoreSavedRef.current = false;
                                setSavedHighScore(null);
                            }}
                        >
                            RESTART
                        </button>
                    </div>
                )}
            </div>

            <div className="spaceInvadersHud">
                <span>
                    LIVES: {game.lives}
                </span>

                <span>
                    SCORE: {game.score}
                </span>

                <span>
                    WAVE: {game.wave}
                </span>
            </div>

        </div>
    );
}