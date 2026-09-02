// This file defines the GameRegistry, which maps game identifiers to their respective components and control schemes.

import type { ComponentType } from "react";

import SnakeGame from "./snake/SnakeGame";
import SpaceInvadersGame from "./spaceInvaders/SpaceInvadersGame";

export type GameComponentProps = {
    gameId: number;
    onScoreSaved: () => void;
};

export type GameControl = {
    key: string;
    action: string;
};

type GameDefinition = {
    component: ComponentType<GameComponentProps>;
    controls: GameControl[];
};

// GameRegistry maps game identifiers to their respective components and control schemes
export const GameRegistry: Record<string, GameDefinition> = {
    snake: {
        component: SnakeGame,
        controls: [
            { key: "W / ↑", action: " Move up" },
            { key: "S / ↓", action: " Move down" },
            { key: "A / ←", action: " Move left" },
            { key: "D / →", action: " Move right" },
        ],
    },

    "space-invaders": {
        component: SpaceInvadersGame,
        controls: [
            { key: "A / ←", action: " Move left" },
            { key: "D / →", action: " Move right" },
            { key: "SPACE", action: " Shoot" },
        ],
    },
};