// Player
// - Represents the player's ship including position and basic movement
// - Stores position and width, provides movement and cloning utilities
export type Position = {
    x: number;
    y: number;
};

export class Player {
    position: Position;
    width: number;

    constructor() {
        this.position = {
            x: 14,
            y: 23,
        };
        this.width = 3;
    }

    moveLeft() {
        if (this.position.x > 0) {
            this.position.x--;
        }
    }

    moveRight(gridWidth: number) {
        if (this.position.x + this.width < gridWidth) {
            this.position.x++;
        }
    }

    resetPosition() {
        this.position.x = 14;
        this.position.y = 23;
    }

    clone() {
        const newPlayer = new Player();

        newPlayer.position = {
            x: this.position.x,
            y: this.position.y,
        };

        newPlayer.width = this.width;

        return newPlayer;
    }
}