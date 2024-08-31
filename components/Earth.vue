<template>
  <div>
    <canvas id="globe"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// Props for the width and height of the globe
const props = defineProps({
  size: {
    type: Number,
    default: 200, // default height if not provided
  },
});

const config = {
  rotationDelay: 0,
  scaleFactor: 0.75,
  degPerSec: 30,
  angles: { x: -100, y: -10, z: 0 },
  colors: {
    water: '#1184c7',
    land: '#fff',
    saudiArabia: '#FABC3F',
    hover: '#eee',
  },
};

const state = {
  currentCountry: null,
  lastTime: d3.now(),
  degPerMs: config.degPerSec / 1000,
  isDragging: false,
  startX: 0,
  startY: 0,
  saudiArabia: null,
};

let elements, projection, path, autorotate, land, countries, countryList;

const initGlobe = () => {
  elements = {
    countryLabel: d3.select('#countryLabel'),
    canvas: d3.select('#globe'),
    context: d3.select('#globe').node().getContext('2d'),
  };

  projection = d3.geoOrthographic().precision(0.1);
  path = d3.geoPath(projection).context(elements.context);

  const setAngles = () => {
    const rotation = projection.rotate();
    rotation[0] = config.angles.x;
    rotation[1] = config.angles.y;
    rotation[2] = config.angles.z;
    projection.rotate(rotation);
  };

  const scale = () => {
    // Use props.size and props.size to set canvas size
    const width = props.size;
    const height = props.size;
    elements.canvas.attr('width', width).attr('height', height);
    projection.scale(Math.min(width, height) / 2).translate([width / 2, height / 2]);
    render();
  };

  const render = () => {
    const { context } = elements;
    context.clearRect(0, 0, props.size, props.size);
    fill({ type: 'Sphere' }, config.colors.water);

    fill(land, config.colors.land);

    if (state.saudiArabia) {
      elements.countryLabel.style('color', config.colors.saudiArabia);
      fill(state.saudiArabia, config.colors.saudiArabia);
    }

    if (state.currentCountry && state.currentCountry !== state.saudiArabia) {
      elements.countryLabel.style('color', 'white');
      fill(state.currentCountry, config.colors.hover);
    }
  };

  const fill = (obj, color) => {
    elements.context.beginPath();
    path(obj);
    elements.context.fillStyle = color;
    elements.context.fill();
  };

  const rotate = (elapsed) => {
    const now = d3.now();
    const diff = now - state.lastTime;
    if (diff < elapsed) {
      const rotation = projection.rotate();
      rotation[0] += diff * state.degPerMs;
      projection.rotate(rotation);
      render();
    }
    state.lastTime = now;
  };

  const loadData = async (cb) => {
    const world = await d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json');
    const countryNames = await d3.tsv(
      'https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv'
    );
    countryNames[110].name = 'Palestine';

    cb(world, countryNames);
  };

  const getCountry = (event) => {
    const pos = projection.invert(d3.pointer(event));
    return countries.features.find((f) =>
      f.geometry.coordinates.find((c1) =>
        d3.polygonContains(c1, pos) || c1.some((c2) => d3.polygonContains(c2, pos))
      )
    );
  };

  const mousemove = (event) => {
    const country = getCountry(event);
    if (!country) {
      if (state.currentCountry) {
        leave(state.currentCountry);
        state.currentCountry = null;
        render();
      }
      return;
    }
    if (country === state.currentCountry) {
      return;
    }
    state.currentCountry = country;
    render();
    enter(country);
  };

  const enter = (country) => {
    const name = countryList.find((c) => parseInt(c.id) === parseInt(country.id))?.name || '';
    elements.countryLabel.text(name);
  };

  const leave = (country) => {
    elements.countryLabel.text('');
  };

  const startRotation = (delay) => {
    autorotate.restart(rotate, delay || 0);
  };

  const dragstarted = (event) => {
    state.isDragging = true;
    state.startX = event.x;
    state.startY = event.y;
    autorotate.stop();
  };

  const dragged = (event) => {
    if (!state.isDragging) {
      return;
    }

    const sensitivity = 0.25; // Adjust the sensitivity of rotation

    const dx = (event.x - state.startX) * sensitivity;
    const dy = (event.y - state.startY) * sensitivity;

    state.startX = event.x;
    state.startY = event.y;

    const rotation = projection.rotate();
    rotation[0] += dx;
    rotation[1] -= dy;
    projection.rotate(rotation);

    render();
  };

  const dragended = () => {
    state.isDragging = false;
    startRotation(config.rotationDelay);
  };

  const init = () => {
    setAngles();
    elements.canvas
    //   .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
      .on('mousemove', mousemove)
      .on('touchmove', mousemove);

    loadData((world, cList) => {
      land = topojson.feature(world, world.objects.land);
      countries = topojson.feature(world, world.objects.countries);
      countryList = cList;

        state.saudiArabia = countries.features.find((country) => {
        console.log(countryList)
        const countryData = countryList.find((c) => parseInt(c.id, 10) === parseInt(country.id, 10));
        return countryData && countryData.name === 'Thailand';
      });

      window.addEventListener('resize', scale);
      scale();
      autorotate = d3.timer(rotate);
    });
  };

  init();
};

onMounted(() => {
  initGlobe();
});
</script>

<style scoped>
#globe {
  /* cursor: move; */
}
</style>
