<script lang="ts">
    import P5, { type Sketch } from 'p5-svelte';
    import { drawFlock, getFPS } from './services/drawing';
    import { createFlock, updateFlock, updateFlockSize } from './services/flock';
    import type { Flock } from './services/flock.type';
    import { boidsSize, flockSize } from './stores/simulation';

    let canvas: any;
    let flock: Flock;
    let avgFPS: string;
    const sketch: Sketch = (p5) => {
        p5.setup = () => {
            canvas = p5.createCanvas(p5.windowWidth * 0.9, (9 / 16) * p5.windowWidth * 0.9, p5.WEBGL);
            flock = createFlock($flockSize, { screenWidth: p5.width, screenHeight: p5.height });
        };
        p5.draw = () => {
            p5.background(0);
            p5.translate(-p5.width / 2, -p5.height / 2);
            updateFlock(flock, { w: p5.width, h: p5.height });
            drawFlock(p5, flock);

            avgFPS = getFPS(p5);
        };
    };

    $: {
        if (canvas) {
            updateFlockSize(flock, $flockSize, { screenWidth: canvas.width, screenHeight: canvas.height });
        }
    }
</script>

<P5 {sketch} />

<span>FPS: {avgFPS}</span>

<label for="flockSize">Flock size</label>
<input id="flockSize" type="number" bind:value={$flockSize} />

<label for="flockSize">Boids size</label>
<input id="flockSize" type="number" bind:value={$boidsSize} />
