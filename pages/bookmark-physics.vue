<template>
  <div id="bookmark-canvas" ref="bookmarkCanvas">
    <canvas id="body-canvas" ref="bodyCanvas"></canvas>
    <pre>
      {{ bodies?.length }}
    </pre>
  </div>
</template>
<script setup>
import axios from 'axios';
import * as d3 from 'd3';
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

const width = ref(1920);
const height = ref(1080 * 8);

const itemLimit = 25000;
const fontSize = 5;
const lineLength = 18;
const timePadding = 100;

const padding = 1;

const { data: everythingCombined, isFinished: finishedEverything } = useAxios(
  '/data/allData.json',
  { method: 'GET' },
  axiosInstance
);

const timeScale = d3
  .scaleLinear()
  .domain([new Date(2020, 0, 1), new Date()])
  // .domain(timestampExtent)
  .range([height.value - timePadding, timePadding]);

// make a computed that sorts everythingCombined by timestamp (if it exists)
const everythingSorted = computed(() => {
  if (!everythingCombined.value) return;
  // return everythingCombined.value.sort((a, b) => {
  //   // the timestamp is a date that looks like
  //   // "2021-03-12T18:08:47.003Z"
  //   // so we need to parse it
  //   const aDate = new Date(a.timestamp);
  //   const bDate = new Date(b.timestamp);
  //   return aDate - bDate;
  // });

  // split the text into lines and add .lines property to each item
  // everythingCombined.value.forEach((item) => {
  //   // if (!item.text) return;
  //   const text = determineText(item);
  //   item.lines = textToLines(text);
  // });

  // return everythingCombined.value.sort((a, b) => {
  //   return d3.descending(a.timestamp, b.timestamp);
  // });

  // shuffle with d3.shuffle and then sort by timestamp
  const shuffledAndSorted = d3
    .shuffle(everythingCombined.value)
    .slice(0, itemLimit)
    .sort((a, b) => {
      return d3.descending(a.timestamp, b.timestamp);
    });

  shuffledAndSorted.forEach((item) => {
    // if (!item.text) return;
    const text = determineText(item);
    item.lines = textToLines(text);

    const image = determineImage(item);

    // if there is an image, it is going to be the URL of an image we need to get
    // and then draw instead of the text
    if (image) {
      // console.log('image', image);
      const img = new Image();
      img.src = image;
      img.onload = () => {
        // console.log('img loaded', img);
        // draw the image
        // context.drawImage(img, body.bounds.min.x, body.bounds.min.y);
        item.imageRaw = img;
        // bind the image width and height to the item so we can use it in the canvasManager
        item.imageWidth = img.width;
        item.imageHeight = img.height;
      };
    }
  });

  // go through and if the type is tweet, check public_metrics, and only include tweets with a like_count above 0
  const filtered = shuffledAndSorted.filter((item) => {
    if (item.type === 'tweet') {
      if (item.public_metrics.like_count > 2) {
        return true;
      }
      return false;
    }
    return true;
  });

  return filtered;
});

// make an extent of the timestamps in everythingSorted
// const timestampExtent = computed(() => {
//   if (!everythingSorted.value) return;
//   return d3.extent(everythingSorted.value, (d) => d.timestamp);
// });

const engine = ref(null);

function itemByIndex(index) {
  // if (!everythingCombined.value) return;
  // return everythingCombined.value[index];
  if (!everythingSorted.value) return;
  return everythingSorted.value[index];
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
  // this.width = 900;
  // this.height = 500;
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

  const years = d3.range(2010, 2023);

  this.drawYears = function () {
    // draw a line in the canvas for each year using timeScale for y position
    // const years = [2010, 2021];
    // use d3 to generate all years between 2010 and 2021

    years.forEach((year) => {
      const y = timeScale(new Date(year, 0, 1));
      this.context.moveTo(0, y);
      this.context.lineTo(this.width, y);
      this.context.strokeStyle = 'black';
      this.context.stroke();
    });

    // add text to label each year line
    years.forEach((year) => {
      const y = timeScale(new Date(year, 0, 1));
      this.context.font = '20px Arial';
      this.context.fillStyle = 'black';
      this.context.fillText(year, 0, y);
    });
  };

  this.drawBodies = function (bodies) {
    // draw a red rectangle at the height and width
    // this.context.fillStyle = 'red';
    // this.context.fillRect(0, 0, width.value, height.value);

    // this.context.clearRect(0, 0, width.value * 100, height.value * 100);

    // clear rect accounting for scale
    this.context.clearRect(0, 0, 10000, 10000);
    // this.context.beginPath();

    this.drawYears();

    bodies.forEach((body) => {
      drawBody(body, this.context);
    });
  };

  return this;
}

function resizeImage(image) {
  const imageWidth = image.width;
  const imageHeight = image.height;
  const maxWidth = 50;
  const maxHeight = 80;
  const widthRatio = maxWidth / imageWidth;
  const heightRatio = maxHeight / imageHeight;
  const ratio = Math.min(widthRatio, heightRatio);
  const newWidth = imageWidth * ratio;
  const newHeight = imageHeight * ratio;
  return { newWidth, newHeight };
}

function drawBody(body, context) {
  const id = body.id;
  const item = itemByIndex(id);
  // const text = determineText(item);
  const lineHeight = fontSize * 0.9;
  // const lines = textToLines(text);
  // const lines = body.lines;
  // get the lines by finding the datapoint in everythingSorted that has the same id as the body
  // const dataPoint = everythingSorted.value.find((point, key) => key === id);
  // console.log({ item });
  let lines = item?.lines;
  if (!lines) return;
  // lines = lines.slice(0, 2);
  // console.log('lines', lines, { dataPoint });
  // const worldBody = world.value.bodies.find((body) => body.id === id);
  // const fillStyle = determineFillStyle(item);
  const fillStyle = determineFillStyle(body);

  context.font = `${fontSize}px Courier`;
  context.fillStyle = fillStyle;

  const image = item?.imageRaw;

  // if (image) console.log({ item });

  // draw a rectangle for the body bounds for debugging purposes
  // context.fillStyle = 'rgba(0,0,0,0.1)';
  // context.fillStyle = 'rgba(255,255,255,0.25)';
  // context.fillRect(
  //   body.bounds.min.x,
  //   body.bounds.min.y,
  //   body.bounds.max.x - body.bounds.min.x,
  //   body.bounds.max.y - body.bounds.min.y
  // );

  if (image) {
    const { newWidth, newHeight } = resizeImage(image);
    context.drawImage(
      image,
      body.bounds.min.x,
      body.bounds.min.y,
      newWidth,
      newHeight
    );
  }

  lines.forEach((line, index) => {
    context.fillText(
      line,
      body.bounds.min.x + padding * 2,
      body.bounds.min.y + padding * 2 + index * lineHeight
    );
  });

  // console.log({ body });
}

function determineText(item) {
  if (item.title) {
    return item.title;
  } else if (item.content) {
    return item.content;
  } else if (item.text) {
    return item.text;
  } else {
    return item.description;
  }
}

function determineImage(item) {
  // if an item is a tweet, it might have a .mediaUrls array
  // if it does, return the first image in the array and grab the .url property out of it

  // if the type is arena log it out

  const isTweet = item?.type === 'tweet';
  const hasMediaUrls = item?.mediaUrls?.length > 0;

  const isArena = item?.type === 'arena';

  if (isArena) {
    // get the URL out of the item
    if (!item?.image) return null;
    return item?.image?.thumb.url;
  }

  if (isTweet && hasMediaUrls) {
    return item.mediaUrls[0].url;
  } else if (item?.image) {
    return item.image;
  } else if (item?.images?.length > 0) {
    return item.images[0];
  } else if (item?.imageUrls?.length > 0) {
    return item.imageUrls[0];
  } else if (item?.imageUrl) {
    return item.imageUrl;
  } else if (item?.url) {
    return item.url;
  } else {
    return null;
  }
}

// make a categorical scale for type
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

function determineFillStyle(item) {
  if (!item) return '#CCC';
  if (item?.render?.fillStyle) {
    return item?.render?.fillStyle;
  } else if (item?.type) {
    return colorScale(item.type);
  } else {
    return 'black';
  }
}

function textToLines(text) {
  const lines = [];

  if (!text) return;

  for (let i = 0; i < text.length; i += lineLength) {
    lines.push(text.substring(i, i + lineLength));
  }

  return lines;
}

const bodyCanvas = ref(null);

// onMounted set the canvasManager context with .setContext to the canvas context
onMounted(() => {
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
    // height.value = window.innerHeight;

    // create an engine
    engine.value = Engine.create({
      positionIterations: 500,
      // constraintIterations: 1000,
      gravity: {
        x: 0,
        y: 0.0,
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
  },
  { immediate: true }
);

// watch everythingSorted and when it changes
// set the timestampExtent to the extent of the timestamps
watch(
  () => everythingSorted.value,
  (everythingSorted) => {
    if (!everythingSorted) return;
    const timestampExtent = d3.extent(
      everythingSorted,
      (d) => new Date(d.timestamp)
    );
    timeScale.domain(timestampExtent);
  }
);

const typeScale = d3
  .scaleBand()
  .domain(['twitter', 'pinboard', 'arena'])
  .paddingInner(0.5)
  .paddingOuter(0.5)
  .range([0, width.value]);

// when everythingSorted is loaded, then we can start the physics engine
// and add each item as a body
watch([everythingSorted, world], () => {
  // check if the world has bodies already, and if so, return
  if (!world.value) return;
  if (world.value.bodies.length > 5) return;

  // otherwise lets add our bodies!

  everythingSorted.value.forEach((item, i) => {
    // const randomPos = {
    //   x: Math.random() * width.value,
    //   y: Math.random() * height.value,
    // };

    // use the timestamp and timeScale to determine the y position
    const y = timeScale(new Date(item.timestamp));
    let x = Math.random() * width.value;

    // make the randomPos object
    const randomPos = {
      x,
      y,
    };

    // get categorical scale from item.type and use it to set the color
    const color = colorScale(item.type);

    // console.log('getting item size from text', item);

    const { width: itemWidth, height: itemHeight } = getItemSize(item);

    // const body = Bodies.rectangle(10, 10, 10, 10, {
    const body = Bodies.rectangle(
      randomPos.x,
      randomPos.y,
      itemWidth,
      itemHeight,
      {
        isStatic: false,
        id: i,
        // add frictionAir to the body
        frictionAir: 0.1,
        render: {
          fillStyle: color,
        },
      }
    );
    World.add(world.value, body);
    i++;
  });
});
function getItemSize(item) {
  // if the item has an image, we will use that
  if (item?.imageRaw) {
    const imageSize = getItemSizeFromImage(item);
    console.log({ imageSize });
    return imageSize;
  } else {
    return getItemSizeFromText(item);
  }
}

function getItemSizeFromImage(item) {
  const image = item.image;
  console.log({ image });

  // resize the image and then get the resized width and height;
  // const resizedImage = resizeImage(image);
  const { newWidth, newHeight } = resizeImage(image);
  console.log({ newWidth, newHeight });
  // const itemWidth = resizedImage.width;
  // const itemHeight = resizedImage.height;
  // return { width: itemWidth, height: itemHeight };
  return { width: newWidth, height: newHeight };
}

function getItemSizeFromText(item) {
  const defaultSize = {
    width: 40,
    height: 40,
  };
  const text = determineText(item);
  // if (!text) return { width: 4, height: 4 };
  if (!text) return defaultSize;
  const lines = textToLines(text);
  // if (!lines) return { width: 4, height: 4 };
  if (!lines) return defaultSize;

  const numLines = lines.length;
  // use the fontSize, lineLength, and numLines to determine the width and height
  const width = fontSize * 0.6 * lineLength + padding * 2;
  const height = fontSize * numLines + padding;

  return { width, height };
}

// destroy the engine and clear the canvas when unmounted
onUnmounted(() => {
  // engine.value.clear();
});
</script>
<style>
#bookmark-canvas {
  width: 100%;
  /* height: 50vh; */
  /* border: 4px solid red; */
}
#body-canvas {
  width: 100vw;
  /* height: 100vh; */
  /* border: 1px solid salmon; */
}
</style>
