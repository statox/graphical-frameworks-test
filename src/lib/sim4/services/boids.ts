import { Vector } from 'ts-matrix';
import type { Boid, BoidCreationParams } from './boids.type';
import { noise3D } from './noise';

export const createBoid = (params: BoidCreationParams): Boid => {
    const x = Math.floor(Math.random() * params.screenWidth);
    const y = Math.floor(Math.random() * params.screenHeight);

    let speed = new Vector([Math.random() * 2 - 1, Math.random() * 2 - 1, 0]);
    speed = speed.normalize();
    speed = speed.scale(3);
    return {
        id: Math.ceil(Math.random() * 100000),
        pos: new Vector([x, y, 0]),
        speed,
        acc: new Vector([0, 0, 0]),
        meta: {
            ticks: 0
        }
    };
};

export const moveBoid = (boid: Boid) => {
    noiseStirring(boid);
    boid.speed = boid.speed.add(boid.acc).normalize().scale(2);
    boid.pos = boid.pos.add(boid.speed);

    boid.acc.reset();
    boid.meta.ticks++;
};

const normal_acceleration = () => new Vector([0.03, 0, 0]);

export const noiseStirring = (boid: Boid) => {
    // const noise = 5 * noise3D(boid.pos.at(0) * 0.005, boid.pos.at(1) * 0.005, 0);
    const noise = 5 * noise3D(boid.pos.at(0) * 0.005, boid.pos.at(1) * 0.005, boid.meta.ticks * 0.005);
    boid.meta.noise = noise;

    const newHeading = noise;

    boid.acc = normal_acceleration();
    const mag = 0.1;
    const x = Math.cos(newHeading) * mag;
    const y = Math.sin(newHeading) * mag;

    boid.acc = new Vector([x, y, 0]);
};

export const keepBoidInScreen = (boid: Boid, w: number, h: number) => {
    let [x, y] = boid.pos.values;
    if (x < 0) {
        x = w;
    }
    if (x > w) {
        x = 0;
    }
    if (y < 0) {
        y = h;
    }
    if (y > h) {
        y = 0;
    }
    boid.pos = new Vector([x, y, 0]);
};
