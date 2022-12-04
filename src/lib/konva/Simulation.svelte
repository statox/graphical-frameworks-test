<script lang="ts">
    import { getWindowWidth } from '$lib/utils/window';

    import Konva from 'konva';
    import { onMount } from 'svelte';
    import { getRefreshedAvgFPS } from './fps';

    let avgFps: string;
    let nbMovers = 1000;
    const movers: any[] = [];
    let width: number;
    let height: number;
    let layer: Konva.Layer;

    const createMover = () => {
        return {
            sprite: new Konva.Circle({
                fill: '#039BE5',
                radius: 5,
                x: width / 2,
                y: height / 2
            }),
            speed: {
                x: Math.random() * 4 - 2,
                y: Math.random() * 4 - 2
            },
            move: function () {
                this.sprite.x(this.sprite.x() + this.speed.x);
                this.sprite.y(this.sprite.y() + this.speed.y);

                if (this.sprite.x() + this.sprite.radius() / 2 > width) {
                    this.sprite.x(this.sprite.radius() / 2);
                }
                if (this.sprite.x() - this.sprite.radius() / 2 < 0) {
                    this.sprite.x(width - this.sprite.radius() / 2);
                }
                if (this.sprite.y() + this.sprite.radius() / 2 > height) {
                    this.sprite.y(this.sprite.radius() / 2);
                }
                if (this.sprite.y() - this.sprite.radius() / 2 < 0) {
                    this.sprite.y(height - this.sprite.radius() / 2);
                }
            }
        };
    };

    let timeDiv = 1;
    onMount(() => {
        if (!document.getElementById('canvas')) {
            return;
        }

        width = getWindowWidth() * 0.9;
        height = (9 / 16) * getWindowWidth() * 0.9;
        const stage = new Konva.Stage({
            container: 'canvas',
            width,
            height
        });
        layer = new Konva.Layer();
        const background = new Konva.Rect({
            width,
            height,
            fill: '#000000'
        });
        layer.add(background);

        for (let i = 0; i < nbMovers; i++) {
            const mover = createMover();
            layer.add(mover.sprite);
            movers.push(mover);
        }
        stage.add(layer);

        var anim = new Konva.Animation(function (frame) {
            if (!frame) {
                console.log('no frame to animate');
                return;
            }

            // Try to be smart and update only half of the flock each frame
            // The results are not super convincing
            // timeDiv++;
            // let start = 0;
            // let end = movers.length / 2;
            // if (timeDiv % 2) {
            //     start = movers.length / 2;
            //     end = movers.length - 1;
            // }
            // for (let i = start; i < end; i++) {
            //     movers[i].move();
            // }

            for (const mover of movers) {
                mover.move();
            }

            avgFps = getRefreshedAvgFPS(frame.timeDiff);
        }, layer);

        anim.start();
    });

    const updateFlock = () => {
        if (!layer) {
            return;
        }
        if (movers.length < nbMovers) {
            for (let i = movers.length; i < nbMovers; i++) {
                const mover = createMover();
                layer.add(mover.sprite);
                movers.push(mover);
            }
        } else {
            for (; movers.length > nbMovers; ) {
                const mover = movers.pop();
                mover.sprite.destroy();
            }
        }
    };
</script>

<div id="canvas" />

<span>FPS: {avgFps}</span>

<label for="nbMoversInput">Flock size</label>
<input id="nbMoversInput" type="number" bind:value={nbMovers} on:change={updateFlock} />
