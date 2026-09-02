// Invader
// - Represents an enemy invader including position and its alive state
import type { Position } from "./Player";

export class Invader {
    position: Position;
    alive: boolean;

    constructor(x: number, y: number) {
        this.position = {
            x,
            y,
        };

        this.alive = true;
    }

    clone() {
        const newInvader = new Invader(
            this.position.x,
            this.position.y
        );

        newInvader.alive = this.alive;

        return newInvader;
    }
}