<template>
  <div id="bookmark-canvas" ref="bookmarkCanvas"></div>
</template>
<script setup>
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
import {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
} from 'matter-js';

const bookmarkCanvas = ref('bookmarkCanvas');

const axiosInstance = axios.create({
  baseURL: '',
});

const { data: everythingCombined, isFinished: finishedEverything } = useAxios(
  '/data/allData.json',
  { method: 'GET' },
  axiosInstance
);
// when everythingCombined is loaded, then we can start the physics engine
// and add each item as a body
watch(
  () => finishedEverything.value,
  (finished) => {
    if (!finished) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // create an engine
    var engine = Engine.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0,
      },
    });

    // create a renderer
    var render = Render.create({
      // element: document.body,
      element: bookmarkCanvas.value,
      engine: engine,
      options: {
        width,
        height,
        background: '#FFF',
      },
    });

    // ground
    // var ground = Bodies.rectangle(100, 610, width, 60, { isStatic: true });

    // add all of the bodies to the world
    // World.add(engine.world, [ground]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.5,
          render: {
            visible: true,
          },
        },
      });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height },
    });

    // add each item as a body with a density of 10
    everythingCombined.value.forEach((item) => {
      const body = Bodies.rectangle(
        Math.random() * width,
        Math.random() * height,
        25,
        25,
        {
          isStatic: false,
        }
      );

      // set body density to 100
      body.density = 1000;
      body.mass = 10000;

      World.add(engine.world, [body]);
    });
  },
  { immediate: true }
);

// destroy the engine and clear the canvas when unmounted
onUnmounted(() => {
  engine.clear();
  render.canvas.remove();
  render.context = null;
  render.textures = {};
});
</script>
<style>
#bookmark-canvas {
  width: 100%;
  height: 50vh;
  /* border: 4px solid red; */
}
</style>
