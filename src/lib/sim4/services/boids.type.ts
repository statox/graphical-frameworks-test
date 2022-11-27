import type { Vector } from 'ts-matrix';

export type BoidCreationParams = {
    screenWidth: number;
    screenHeight: number;
}
export type Boid = {
    id: number; // random number
    pos: Vector;    // in px
    speed: Vector;  // in px/frame
    acc: Vector;
    meta: {
        ticks: number; // number of time the boid has been updated
        noise?: number; // [-1, 1]
        sprite?: Circle;
    }
}
