import type { Position } from "./Snake";

export class Food {
    position: Position;

    constructor(gridSize: number, occupiedPositions: Position[]) {
        this.position = this.generatePosition(
            gridSize,
            occupiedPositions
        );
    }

    generatePosition(
        gridSize: number,
        occupiedPositions: Position[]
    ): Position {
        const availablePositions: Position[] = [];

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const occupied = occupiedPositions.some(
                    (position) =>
                        position.x === x &&
                        position.y === y
                );

                if (!occupied) {
                    availablePositions.push({ x, y });
                }
            }
        }

        const randomIndex = Math.floor(
            Math.random() * availablePositions.length
        );

        return availablePositions[randomIndex];
    }
}