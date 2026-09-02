export type Position = {
    x: number;
    y: number;
};

export type Direction = "up" | "down" | "left" | "right";

// Snake class
// - Manages the snake body, current and queued direction
// - Provides movement, growth and utility methods used by Game
export class Snake {
    body: Position[];
    direction: Direction;
    nextDirection: Direction | null;

    constructor(startX: number, startY: number) {
        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY },
        ];

        this.direction = "right";
        this.nextDirection = null;
    }

    setDirection(newDirection: Direction) {
        // Decide whether to accept a new queued direction. Prevent 180-degree turns and limit to one queued turn.
        const oppositeDirections: Record<Direction, Direction> = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        };

        // Compare against the queued direction if one exists.
        const currentDirection =
            this.nextDirection ?? this.direction;

        if (
            oppositeDirections[currentDirection] ===
            newDirection
        ) {
            return;
        }

        // Only allow one queued turn.
        if (this.nextDirection !== null) {
            return;
        }

        this.nextDirection = newDirection;
    }

    move() {
        // Move the snake forward by one cell, applying any queued turn first.
        // The tail is removed unless the snake grows.
        if (this.nextDirection !== null) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
        }

        const head = this.body[0];

        const newHead: Position = {
            x: head.x,
            y: head.y,
        };

        switch (this.direction) {
            case "up":
                newHead.y--;
                break;

            case "down":
                newHead.y++;
                break;

            case "left":
                newHead.x--;
                break;

            case "right":
                newHead.x++;
                break;
        }

        this.body.unshift(newHead);
        this.body.pop();
    }

    grow() {
        // Add a new segment at the tail's position; actual movement will separate it on next move.
        const tail = this.body[this.body.length - 1];

        this.body.push({
            x: tail.x,
            y: tail.y,
        });
    }

    containsPosition(position: Position) {
        // Check whether the given grid position is occupied by the snake
        return this.body.some(
            (segment) =>
                segment.x === position.x &&
                segment.y === position.y
        );
    }

    clone() {
        const newSnake = new Snake(0, 0);

        newSnake.body = this.body.map((segment) => ({
            x: segment.x,
            y: segment.y,
        }));

        newSnake.direction = this.direction;
        newSnake.nextDirection = this.nextDirection;

        return newSnake;
    }
}