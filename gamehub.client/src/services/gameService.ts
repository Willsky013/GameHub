// This file contains functions to interact with the game API.

export type Game = {
    id: number;
    name: string;
    description: string;
    slug: string;
    image: string | null;
    category: string | null;
};

// Fetches a list of all games from the API.
export async function getGames(): Promise<Game[]> {
    const response = await fetch("/api/games");

    if (!response.ok) {
        throw new Error("Failed to load games");
    }

    return await response.json();
}

// Fetches a specific game by its slug from the API.
export async function getGameBySlug(slug: string): Promise<Game> {
    const response = await fetch(`/api/games/${slug}`);

    if (!response.ok) {
        throw new Error("Game not found");
    }

    return await response.json();
}