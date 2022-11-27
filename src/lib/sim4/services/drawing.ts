import type { Boid } from './boids.type';
import type { Flock } from './flock.type';
import { get } from 'svelte/store';
import { boidsSize } from '../stores/simulation';
import type Two from 'two.js';
import { map } from '$lib/utils/map';

const drawBoid = (two: Two, boid: Boid) => {
    const boid_size = get(boidsSize);
    if (!boid.meta.sprite) {
        boid.meta.sprite = two.makeCircle(boid.pos.at(0), boid.pos.at(1), boid_size);
    }

    boid.meta.sprite.radius = boid_size;
    const normalizedNoise = map(boid.meta.noise || 0, -5, 5, 255, 0);
    boid.meta.sprite.fill = `rgb(${normalizedNoise}, 100, 100)`;
    boid.meta.sprite.position.set(boid.pos.at(0), boid.pos.at(1));
};

export const drawFlock = (two: Two, flock: Flock) => {
    flock.boids.forEach(b => drawBoid(two, b));
};

const fpsHistory: number[] = [];
export const getFPS = (two: Two) => {
    const timeSinceLastFrameMs = two.timeDelta;
    fpsHistory.push(timeSinceLastFrameMs);
    if (fpsHistory.length > 60) fpsHistory.shift();

    const timeForLast60Frames = fpsHistory.reduce((total, r) => total + r, 0);
    return (1000 * 60 / timeForLast60Frames).toFixed(0);
};
