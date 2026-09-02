// Score Service
// This service handles saving and retrieving scores for games.
export type SaveScoreResponse = {
    message: string;
    score: number;
    highScore: number;
    isNewHighScore: boolean;
};

export type Score = {
    scoreValue: number;
    gameId: number;
    createdAt: string;
};

export type GameScore = {
    scoreValue: number;
    gameId: number;
    createdAt: string;
    displayName: string;
};

// Save a score for a game. Returns the saved score and whether it was a new high score.
export async function saveScore(
    gameId: number,
    scoreValue: number
): Promise<SaveScoreResponse> {
    const response = await fetch("/api/scores", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gameId,
            scoreValue,
        }),
    });

    const text = await response.text();

    if (!response.ok) {
        let message = "Failed to save score.";

        try {
            const data = JSON.parse(text);
            message = data.message || message;
        } catch {
            // Response wasn't JSON
        }

        throw new Error(message);
    }

    return JSON.parse(text);
}

// Get scores for the current user, optionally filtered by gameId and limited to a certain number of results.
export async function getScores(
    gameId?: number,
    limit: number = 0
): Promise<Score[]> {
    const params = new URLSearchParams();

    if (gameId !== undefined) {
        params.set("gameId", gameId.toString());
    }

    if (limit > 0) {
        params.set("limit", limit.toString());
    }

    const query = params.toString();

    const response = await fetch(
        `/api/scores/me${query ? `?${query}` : ""}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) {
        return [];
    }

    if (!response.ok) {
        throw new Error("Failed to load scores.");
    }

    return await response.json();
}

// Get scores for a specific game, optionally limited to a certain number of results.
export async function getGameScores(
    gameId: number,
    limit: number = 0
): Promise<GameScore[]> {
    const params = new URLSearchParams();

    if (limit > 0) {
        params.set("limit", limit.toString());
    }

    const query = params.toString();

    const response = await fetch(
        `/api/scores/${gameId}${query ? `?${query}` : ""}`
    );

    if (!response.ok) {
        throw new Error("Failed to load game scores.");
    }

    return await response.json();
}