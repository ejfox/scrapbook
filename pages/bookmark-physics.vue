<template>
  <div id="bookmark-canvas" ref="bookmarkCanvas">
    <pre>
      <!-- {{ bodies }} -->
    </pre>
    <canvas id="body-canvas" ref="bodyCanvas"></canvas>
  </div>
</template>
<script setup>
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
import {
  Engine,
  Events,
  Render,
  Runner,
  World,
  Bodies,
  Composite,
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

const width = ref(1920);
const height = ref(1080);

const engine = ref(null);

function itemByIndex(index) {
  if (!everythingCombined.value) return;
  return everythingCombined.value[index];
}

const world = computed(() => {
  if (!engine.value) return;
  return engine.value.world;
});

const bodies = computed(() => {
  if (!world.value) return;
  if (!engine.value) return;
  return Composite.allBodies(world.value);
});

// when bodies is updated, console log it
// watch(
//   () => bodies.value,
//   (bodies) => {
//     console.log('bodies', bodies);
//   }
// );

// make a loop to run Engine.update(engine, delta) every 1000/60 ms
const runner = ref(null);

// when the runner is running, update the engine and console log the tick
// watch(
//   () => runner.value,
//   (runner) => {
//     if (!runner) return;
//     Runner.run(runner, engine.value);
//     Events.on(runner, 'tick', (event) => {
//       console.log('tick', event);
//     });
//   }
// );

// we are going to use a pattern where we create a CanvasManager function that will handle setting the context, size, and drawing the bodies
// then we will create a canvasManager instance and pass it to the watch function
// the watch function will run when the runner is running, and will call the canvasManager.drawBodies function

function CanvasManager(canvas, { width, height }) {
  this.context = null;
  this.width = 900;
  this.height = 500;
  this.scale = 1;

  this.setContext = function (context) {
    this.context = context;
    // set DPI for retina displays
    const dpi = window.devicePixelRatio;
    this.scale = dpi;
    // set the canvas style size
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    // set the context scale
    context.scale(dpi, dpi);
  };

  this.setSize = function (width, height) {
    this.width = width;
    this.height = height;
  };

  this.drawBodies = function (bodies) {
    // this.context.clearRect(0, 0, this.width, this.height);
    // clear rect accounting for scale
    this.context.clearRect(0, 0, 10000, 10000);
    this.context.beginPath();
    bodies.forEach((body) => {
      const id = body.id;
      const item = itemByIndex(id);
      let text;
      // if we have a title, use that
      // if we have a content, use that
      // if we have neither, use the description
      if (item.title) {
        text = item.title;
      } else if (item.content) {
        text = item.content;
      } else {
        text = item.description;
      }

      // draw a rectangle
      // this.context.rect(
      //   body.position.x,
      //   body.position.y,
      //   body.bounds.max.x - body.bounds.min.x,
      //   body.bounds.max.y - body.bounds.min.y
      // );

      this.context.font = '9px Arial';
      this.context.fillStyle = 'black';
      // this.context.fillText(text, body.position.x, body.position.y);
      // we need to do some artificial line-wrapping
      // because canvas does not provide it for us
      // so we will limit lines to 10 characters
      // and then split the text into lines
      // and then draw each line
      const lines = [];
      const lineLength = 14;
      const lineHeight = 8;
      for (let i = 0; i < text.length; i += lineLength) {
        lines.push(text.substring(i, i + lineLength));
      }

      // calculate the width and height of the text
      // based on the number of lines, font size, and line height
      // we will use this to inform the size of the body
      const textWidth = lines.length * lineHeight;
      const textHeight = lines.length * lineHeight;

      // draw the text
      lines.forEach((line, index) => {
        this.context.fillText(
          line,
          body.position.x,
          body.position.y + index * lineHeight
        );
      });

      // update the body size
      // so that it is the same size as the text
      // this is a hacky way to do it
      // but it works for now
      // we will need to figure out a better way to do this

      // first we need to get the correct body from the world
      // because the bodies we are passing in are not the same as the bodies in the world
      // the bodies in the world have been updated by the engine
      // so we need to get the body from the world
      // and then update the size of that body
      const worldBody = world.value.bodies.find((body) => body.id === id);
      // now we can update the size of the body
      // we need to do this because the body size is used to calculate collisions
      // and we want the body to be the same size as the text
      worldBody.bounds.max.x = worldBody.bounds.min.x + textWidth;
      worldBody.bounds.max.y = worldBody.bounds.min.y + textHeight;
    });
    this.context.fillStyle = 'black';
    this.context.fill();
  };

  // a rectangle that jiggles around the screen
  this.drawDebugRect = function () {
    this.context.clearRect(
      0,
      0,
      this.width * this.scale,
      this.height * this.scale
    );
    this.context.beginPath();
    this.context.rect(Math.random() * 100, Math.random() * 100, 100, 100);
    this.context.fillStyle = 'red';
    this.context.fill();
  };

  return this;
}

const bodyCanvas = ref(null);

// onMounted set the canvasManager context with .setContext to the canvas context
onMounted(() => {
  // width.value = window.innerWidth;
  // height.value = window.innerHeight;
  // const width = width.value;
  // const height = height.value;
  // const canvasManager = new CanvasManager(bodyCanvas.value);
  // canvasManager.setContext(bodyCanvas.value.getContext('2d'));
  // canvasManager.setSize(width, height);

  // set up the canvas width and height
  // width.value = window.innerWidth;
  // height.value = window.innerHeight;
  // const width = width.value;
  // const height = height.value;

  // create a canvasManager instance
  const canvasManager = new CanvasManager(bodyCanvas.value, {
    width: width.value,
    height: height.value,
  });

  // set the canvasManager context
  canvasManager.setContext(bodyCanvas.value.getContext('2d'));

  // set the canvasManager size
  canvasManager.setSize(width, height);

  // use the runner to create an animation loop to repeatedly draw the debug rect
  watch(
    () => runner.value,
    (runner) => {
      if (!runner) return;
      Runner.run(runner, engine.value);
      Events.on(runner, 'tick', (event) => {
        // console.log('tick', event);
        // canvasManager.drawDebugRect();
        canvasManager.drawBodies(bodies.value);
      });
    }
  );
});

// when everythingCombined is loaded, then we can start the physics engine
// and add each item as a body
watch(
  () => finishedEverything.value,
  (finished) => {
    if (!finished) return;
    width.value = window.innerWidth;
    height.value = window.innerHeight;

    // create an engine
    engine.value = Engine.create({
      // positionIterations: 1000,
      // constraintIterations: 1000,
      gravity: {
        x: 0,
        y: 0,
        scale: 0.1,
      },
    });

    // create a runner
    runner.value = Runner.create();

    // use Matter.Events to subscribe to the engine's 'beforeUpdate'
    // event, which is fired before each update
    // Events.on(engine.value, 'beforeUpdate', () => {
    //   CompositionEvent.allBodies(world).forEach((body) => {
    //     // make sure all bodies have a maximum tilt of 12 degrees
    //     Body.setAngle(body, Math.clamp(body.angle, -0.2, 0.2));
    //   });
    // });

    // create a body for each item
    // everythingCombined.value.slice(0, 1000).forEach((item) => {
    //   const randomPos = {
    //     x: Math.random() * width.value,
    //     y: Math.random() * height.value,
    //   };
    //   // const body = Bodies.rectangle(10, 10, 10, 10, {
    //   const body = Bodies.rectangle(randomPos.x, randomPos.y, 100, 300, {
    //     isStatic: false,
    //   });
    //   World.add(world.value, body);
    // });

    // every tick add another body from everythingCombined
    let i = 0;
    Events.on(runner.value, 'tick', (event) => {
      // console.log('tick', event);
      if (i < everythingCombined.value.length) {
        const item = everythingCombined.value[i];
        const randomPos = {
          x: Math.random() * width.value,
          y: Math.random() * height.value,
        };
        // const body = Bodies.rectangle(10, 10, 10, 10, {
        const body = Bodies.rectangle(randomPos.x, randomPos.y, 30, 70, {
          isStatic: false,
        });
        World.add(world.value, body);
        i++;
      }
    });
  },
  { immediate: true }
);

// destroy the engine and clear the canvas when unmounted
onUnmounted(() => {
  // engine.value.clear();
});
</script>
<style>
#bookmark-canvas {
  width: 100%;
  height: 50vh;
  /* border: 4px solid red; */
}
#body-canvas {
  width: 100vw;
  height: 100vh;
  border: 1px solid salmon;
}
</style>
