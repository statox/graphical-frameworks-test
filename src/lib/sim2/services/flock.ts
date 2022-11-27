import { createBoid, keepBoidInScreen, moveBoid } from './boids';
import type { BoidCreationParams } from './boids.type';
import type { Flock } from './flock.type';

export const createFlock = (numberOfBoids: number, params: BoidCreationParams): Flock => {
    const flock: Flock = {
        boids: []
    };

    for (let i = 0; i < numberOfBoids; i++) {
        flock.boids.push(createBoid(params));
    }

    return flock;
};

export const updateFlockSize = (flock: Flock, targetSize: number, params: BoidCreationParams) => {
    if (targetSize < 0 || !flock) {
        return;
    }

    const diff = targetSize - flock.boids.length;
    if (diff < 0) {
        flock.boids.splice(diff);
        return;
    }

    for (let i = 0; i < diff; i++) {
        flock.boids.push(createBoid(params));
    }
};

export const updateFlock = (flock: Flock, screenParams: { w: number, h: number }) => {
    for (const boid of flock.boids) {
        moveBoid(boid);
        keepBoidInScreen(boid, screenParams.w, screenParams.h);
    }
};

