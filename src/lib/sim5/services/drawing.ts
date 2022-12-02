import type { p5 } from 'p5-svelte';
import type { Boid } from './boids.type';
import type { Flock } from './flock.type';
import { get } from 'svelte/store';
import { boidsSize } from '../stores/simulation';

const drawBoid = (p: p5, boid: Boid) => {
    const normalizedId = p.map(boid.meta.noise || 0, -5, 5, 255, 0);
    p.fill(normalizedId, 100, 100);

    const angle = Math.atan2(boid.speed.at(1), boid.speed.at(0)) - Math.PI / 2;

    p.push();
    p.translate(boid.pos.at(0), boid.pos.at(1));
    p.rotate(angle);

    const boid_size = get(boidsSize);

    const topPoint = {
        x: 0,
        y: boid_size
    };
    const bottomLeftPoint = {
        x: -boid_size,
        y: -boid_size
    };
    const bottomRightPoint = {
        x: boid_size,
        y: -boid_size
    };
    p.triangle(topPoint.x, topPoint.y, bottomLeftPoint.x, bottomLeftPoint.y, bottomRightPoint.x, bottomRightPoint.y);

    p.pop();
};

export const drawFlock = (p: p5, flock: Flock) => {
    p.noStroke();
    flock.boids.forEach(b => drawBoid(p, b));
};

const fpsHistory: number[] = [];
export const getFPS = (p: p5) => {
    fpsHistory.push(p.frameRate());
    if (fpsHistory.length > 60) fpsHistory.shift();
    const avgFrameRate = fpsHistory.reduce((avg, r) => avg + r / fpsHistory.length, 0);
    return avgFrameRate.toFixed(0);
};
