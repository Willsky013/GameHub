import type { Direction, Snake } from "./Snake";
import type { Food } from "./Food";

import Backround from "./images/Backround.png";
import Apple from "./images/Apple.png";
import SnakeHead from "./images/SnakeHead.png";
import SnakeBody from "./images/SnakeBody.png";
import SnakeCorner from "./images/SnakeBodyCorner.png";
import SnakeTail from "./images/SnakeTail.png";

type SnakeRendererProps = {
    snake: Snake;
    food: Food;
};

// SnakeRenderer
// - Renders the game grid and draws snake segments, head, tail and food sprites
// - Determines sprite rotation based on segment directions
export default function SnakeRenderer({
    snake,
    food,
}: SnakeRendererProps) {

    // Convert a direction into a rotation angle for sprite rendering
    const getRotation = (direction: Direction) => {
        switch (direction) {
            case "up":
                return 0;

            case "right":
                return 90;

            case "down":
                return 180;

            case "left":
                return 270;
        }
    };

    // Calculate direction from one cell to another (used to orient body pieces)
    const getDirection = (
        from: { x: number; y: number },
        to: { x: number; y: number }
    ): Direction => {
        if (to.x > from.x) return "right";
        if (to.x < from.x) return "left";
        if (to.y > from.y) return "down";

        return "up";
    };

    // Get rotation for corner pieces based on incoming and outgoing directions
    const getCornerRotation = (
        directionToPrevious: Direction,
        directionToNext: Direction
    ) => {
        // UP + RIGHT
        if (
            (directionToPrevious === "up" &&
                directionToNext === "right") ||
            (directionToPrevious === "right" &&
                directionToNext === "up")
        ) {
            return 180;
        }

        // RIGHT + DOWN
        if (
            (directionToPrevious === "right" &&
                directionToNext === "down") ||
            (directionToPrevious === "down" &&
                directionToNext === "right")
        ) {
            return 270;
        }

        // DOWN + LEFT
        if (
            (directionToPrevious === "down" &&
                directionToNext === "left") ||
            (directionToPrevious === "left" &&
                directionToNext === "down")
        ) {
            return 0;
        }

        // LEFT + UP
        if (
            (directionToPrevious === "left" &&
                directionToNext === "up") ||
            (directionToPrevious === "up" &&
                directionToNext === "left")
        ) {
            return 90;
        }

        return 0;
    };

    return (
        <div
            className="gameBoard"
            style={{
                gridTemplateColumns: "repeat(20, 1fr)",
            }}
        >
            {Array.from(
                { length: 20 * 20 },
                (_, index) => {
                    const x = index % 20;
                    const y = Math.floor(index / 20);

                    const snakeIndex =
                        snake.body.findIndex(
                            (segment) =>
                                segment.x === x &&
                                segment.y === y
                        );

                    const isSnake = snakeIndex !== -1;
                    const isHead = snakeIndex === 0;
                    const isTail =
                        isSnake &&
                        snakeIndex ===
                        snake.body.length - 1;

                    const isFood =
                        food.position.x === x &&
                        food.position.y === y;

                    let sprite = null;
                    let rotation = 0;

                    /*
                     * HEAD
                     * Render the head sprite and rotate based on current direction
                     */
                    if (isHead) {
                        sprite = SnakeHead;

                        rotation = getRotation(
                            snake.direction
                        );
                    }

                    /*
                     * TAIL
                     * Render the tail sprite and rotate to match the segment before it
                     */
                    else if (isTail) {
                        sprite = SnakeTail;

                        const previous =
                            snake.body[snakeIndex - 1];

                        const current =
                            snake.body[snakeIndex];

                        const direction =
                            getDirection(current, previous);

                        rotation = getRotation(direction);
                    }

                    /*
                     * BODY
                     * Choose straight body or corner sprite depending on neighboring segments
                     */
                    else if (isSnake) {
                        const previous = snake.body[snakeIndex - 1];
                        const current = snake.body[snakeIndex];
                        const next = snake.body[snakeIndex + 1];

                        const directionToPrevious =
                            getDirection(current, previous);

                        const directionToNext =
                            getDirection(current, next);

                        const isStraight =
                            directionToPrevious === "up" &&
                            directionToNext === "down" ||
                            directionToPrevious === "down" &&
                            directionToNext === "up" ||
                            directionToPrevious === "left" &&
                            directionToNext === "right" ||
                            directionToPrevious === "right" &&
                            directionToNext === "left";

                        if (isStraight) {
                            sprite = SnakeBody;

                            rotation = getRotation(
                                directionToPrevious
                            );
                        } else {
                            sprite = SnakeCorner;

                            rotation = getCornerRotation(
                                directionToPrevious,
                                directionToNext
                            );
                        }
                    }

                    /*
                     * FOOD
                     * Render food (apple) when the cell matches food position
                     */
                    else if (isFood) {
                        sprite = Apple;
                    }

                    return (
                        <div
                            key={index}
                            className="cell"
                            style={{
                                backgroundImage:
                                    `url(${Backround})`,
                                backgroundSize:
                                    "30px 30px",
                            }}
                        >
                            {sprite && (
                                <img
                                    src={sprite}
                                    className="snakeSprite"
                                    style={{
                                        transform:
                                            `rotate(${rotation}deg)`,
                                    }}
                                    alt=""
                                />
                            )}
                        </div>
                    );
                }
            )}
        </div>
    );
}