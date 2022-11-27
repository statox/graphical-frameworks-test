import type { Image } from 'p5';
import type { p5 } from 'p5-svelte';
import type { Boid } from './boids.type';
import type { Flock } from './flock.type';
import { get } from 'svelte/store';
import { boidsSize } from '../stores/simulation';

const drawBoid = (p: p5, boid: Boid, sprite: Image) => {
    const normalizedId = p.map(boid.meta.noise || 0, -5, 5, 255, 0);
    p.tint(100, 100, normalizedId);

    const angle = Math.atan2(boid.speed.at(1), boid.speed.at(0)) - Math.PI / 2;

    p.push();
    p.translate(boid.pos.at(0), boid.pos.at(1));
    p.rotate(angle);

    const boid_size = get(boidsSize);

    p.image(sprite, 0, 0, boid_size, boid_size);

    p.pop();
};

export const drawFlock = (p: p5, flock: Flock, sprite: any) => {
    p.noStroke();
    flock.boids.forEach(b => drawBoid(p, b, sprite));
};

const fpsHistory: number[] = [];
export const getFPS = (p: p5) => {
    fpsHistory.push(p.frameRate());
    if (fpsHistory.length > 60) fpsHistory.shift();
    const avgFrameRate = fpsHistory.reduce((avg, r) => avg + r / fpsHistory.length, 0);
    return avgFrameRate.toFixed(0);
};

export const getSprite = (p: p5) => {
    const sprite = p.createImage(33, 33);
    sprite.loadPixels();
    const white = p.color(255, 255, 255);
    let offset = 0;
    for (let y = sprite.height; y >= 0; y--) {
        for (let dx = 0; dx < offset; dx++) {
            sprite.set(Math.ceil(sprite.width / 2) + dx, y, white);
            sprite.set(Math.ceil(sprite.width / 2) - dx, y, white);
        }
        offset += 0.5;
    }
    sprite.set(0, 0, white);
    sprite.updatePixels();
    return sprite;
};
