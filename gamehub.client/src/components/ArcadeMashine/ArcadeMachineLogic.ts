// This file contains the logic for the ArcadeMachine component.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getGames,
    type Game,
} from "../../services/gameService";

import {
    getGameScores,
    getScores,
    type GameScore,
    type Score,
} from "../../services/scoreService";

import { useAuth } from "../../hooks/useAuth";

const arcadeGameSlugs = [
    "snake",
    "space-invaders",
];

function getArcadeGames(
    allGames: Game[],
    slugs: string[]
): Game[] {
    return slugs
        .map((slug) =>
            allGames.find(
                (game) => game.slug === slug
            )
        )
        .filter(
            (game): game is Game =>
                game !== undefined
        );
}

function getPreviousIndex(
    currentIndex: number,
    gameCount: number
): number {
    if (gameCount === 0) {
        return 0;
    }

    return currentIndex === 0
        ? gameCount - 1
        : currentIndex - 1;
}

function getNextIndex(
    currentIndex: number,
    gameCount: number
): number {
    if (gameCount === 0) {
        return 0;
    }

    return currentIndex === gameCount - 1
        ? 0
        : currentIndex + 1;
}

export function useArcadeMachine() {
    const [games, setGames] = useState<Game[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showHighScore, setShowHighScore] = useState(false);

    const [highScore, setHighScore] =
        useState<GameScore | null>(null);

    const [myHighScore, setMyHighScore] =
        useState<Score | null>(null);

    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function loadArcadeGames() {
            try {
                const allGames = await getGames();

                const arcadeGames = getArcadeGames(
                    allGames,
                    arcadeGameSlugs
                );

                setGames(arcadeGames);
            } catch (error) {
                console.error(
                    "Failed to load arcade games:",
                    error
                );
            }
        }

        loadArcadeGames();
    }, []);

    const selectedGame = games[selectedIndex];

    useEffect(() => {
        if (!selectedGame) {
            return;
        }

        async function loadScores() {
            try {
                const topScores =
                    await getGameScores(
                        selectedGame.id,
                        1
                    );

                setHighScore(
                    topScores[0] ?? null
                );

                if (isLoggedIn) {
                    const scores =
                        await getScores(
                            selectedGame.id,
                            1
                        );

                    setMyHighScore(
                        scores[0] ?? null
                    );
                } else {
                    setMyHighScore(null);
                }
            } catch (error) {
                console.error(
                    "Failed to load arcade scores:",
                    error
                );
            }
        }

        loadScores();
    }, [selectedGame, isLoggedIn]);

    function previousGame() {
        setSelectedIndex((currentIndex) =>
            getPreviousIndex(
                currentIndex,
                games.length
            )
        );

        setShowHighScore(false);
    }

    function nextGame() {
        setSelectedIndex((currentIndex) =>
            getNextIndex(
                currentIndex,
                games.length
            )
        );

        setShowHighScore(false);
    }

    function toggleScreen() {
        setShowHighScore((current) => !current);
    }

    function playGame() {
        if (!selectedGame) {
            return;
        }

        navigate(`/game/${selectedGame.slug}`);
    }

    return {
        selectedGame,
        showHighScore,
        highScore,
        myHighScore,
        isLoggedIn,
        user,
        previousGame,
        nextGame,
        toggleScreen,
        playGame,
    };
}