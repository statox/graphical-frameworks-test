<script lang="ts">
    import Two from 'two.js';
    import { onMount } from 'svelte';
    import type { Flock } from './services/flock.type';
    import { createFlock, updateFlock, updateFlockSize } from './services/flock';
    import { boidsSize, flockSize } from './stores/simulation';
    import { drawFlock } from './services/drawing';
    import { getFPS } from './services/drawing';

    let elem: HTMLElement;
    let flock: Flock;
    let avgFPS: string;

    onMount(() => {
        if (!document.getElementById('canvas')) {
            return;
        }
        elem = document.getElementById('canvas') as HTMLElement;
        var params = {
            fullscreen: false
        };
        const two = new Two(params).appendTo(elem);

        two.renderer.domElement.style.background = 'rgb(0, 0, 0)';

        flock = createFlock($flockSize, { screenWidth: elem.offsetWidth, screenHeight: elem.offsetHeight });

        const update = () => _update();
        two.bind('update', update).play();

        function _update() {
            updateFlock(flock, { w: elem.offsetWidth, h: elem.offsetHeight });
            drawFlock(two, flock);
            avgFPS = getFPS(two);
        }
    });

    $: {
        if (elem) {
            updateFlockSize(flock, $flockSize, { screenWidth: elem.offsetWidth, screenHeight: elem.offsetHeight });
        }
    }
</script>

<div id="canvas" />

<span>FPS: {avgFPS}</span>

<label for="flockSize">Flock size</label>
<input id="flockSize" type="number" bind:value={$flockSize} />

<label for="flockSize">Boids size</label>
<input id="flockSize" type="number" bind:value={$boidsSize} />
