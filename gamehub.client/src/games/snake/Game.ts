import { Snake } from "./Snake";
import { Food } from "./Food";

// Game constants
// - GRID_SIZE: number of cells in one dimension of the square grid
// - INITIAL_MOVE_SPEED: initial interval (ms) between moves
// - MIN_MOVE_SPEED: lower bound for move interval (fastest)
// - SPEED_INCREASE: ms to reduce from move speed when snake eats food
export const GRID_SIZE = 20;
export const INITIAL_MOVE_SPEED = 160;
export const MIN_MOVE_SPEED = 60;
export const SPEED_INCREASE = 2;

// Game class
// - Holds snake, food, score, move speed and game over state
// - move(): advances the game state, handles collisions, eating and speed changes
export class Game {
    snake: Snake;
    food: Food;
    score: number;
    gameOver: boolean;
    moveSpeed: number;

    constructor() {
        this.snake = new Snake(10, 10);
        this.food = new Food(GRID_SIZE, this.snake.body);

        this.score = 0;
        this.gameOver = false;

        this.moveSpeed = INITIAL_MOVE_SPEED;
    }

    move() {
        // Advance the game one step
        if (this.gameOver) {
            return;
        }

        const newSnake = this.snake.clone();

        newSnake.move();

        const head = newSnake.body[0];

        // Wall collision
        if (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE
        ) {
            this.gameOver = true;
            return;
        }

        // Self collision
        const hitSelf = newSnake.body
            .slice(1)
            .some(
                (segment) =>
                    segment.x === head.x &&
                    segment.y === head.y
            );

        if (hitSelf) {
            this.gameOver = true;
            return;
        }

        // Food collision
        const ateFood =
            head.x === this.food.position.x &&
            head.y === this.food.position.y;

        if (ateFood) {
            newSnake.grow();

            this.score++;

            this.moveSpeed = Math.max(
                MIN_MOVE_SPEED,
                this.moveSpeed - SPEED_INCREASE
            );

            this.food = new Food(
                GRID_SIZE,
                newSnake.body
            );
        }

        this.snake = newSnake;
    }

    clone() {
        const newGame = new Game();

        newGame.snake = this.snake.clone();
        newGame.food = this.food;

        newGame.score = this.score;
        newGame.gameOver = this.gameOver;
        newGame.moveSpeed = this.moveSpeed;

        return newGame;
    }
}