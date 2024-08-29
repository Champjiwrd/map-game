<template>
  <div class="bg-[#1E2A5E] h-dvh">
    <longdo-map
      ref="longdoMap"
      class="h-full relative"
      @load="onLoad"
      ui="Mobile"
    >
      <StartGame v-if="isHome" :is-map-loaded="isMapLoaded" @start="newGame" />
      <FinishSummary
        v-if="isFinish"
        :score="score"
        :mapUrl="mapUrl"
        :time="stopwatchRef?.formattedTime"
        @newGame="newGame"
      />
      <div class="absolute top-0 left-0 right-0 flex flex-col justify-center">
        <div class="flex px-4 space-x-2 mt-6 justify-center">
          <div ref="heartContainer">
            <HeartContainer :attempt="attempt" />
          </div>
          <div
            class="bg-white p-4 rounded-xl shadow-xl font-semibold border-b-4 border-sky-500 text-xl flex items-center w-full max-w-md"
          >
            <div class="bg-gray-200 w-[100%] h-4 p-0.5">
              <div
                class="h-full bg-sky-500"
                :style="{
                  width: `${
                    (currentProvinceQuestion / provinceList.length) * 100
                  }%`,
                }"
              ></div>
            </div>
            <div class="text-sm ml-2">
              {{ currentProvinceQuestion }}/{{ provinceList.length }}
            </div>
          </div>
        </div>

        <div
          v-if="currentProvinceQuestion !== provinceList.length"
          class="flex justify-center space-x-2"
        >
          <div
            class="bg-white p-4 rounded-xl mt-2 shadow-xl font-semibold border-b-4 border-sky-500 text-xl"
          >
            {{
              provinceList[randomProvinceList[currentProvinceQuestion]]
                ?.PROVINCE_NAME
            }}
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 flex justify-center space-x-2"
      >
        <button
          class="bg-white p-4 rounded-xl mb-6 shadow-xl font-semibold border-b-4 border-sky-500 text-xl flex items-center justify-center"
          @click="newGame"
        >
          <SvgRestart class="w-5 h-5 text-xl" />
        </button>
        <div
          class="bg-white rounded-xl mb-6 shadow-xl font-semibold border-b-4 border-sky-500 text-xl w-24 flex justify-center items-center"
        >
          <Clock ref="stopwatchRef" />
        </div>
      </div>
      <div
        v-if="false"
        class="absolute left-20 bg-white top-28 w-[450px] drop-shadow-md overflow-y-auto max-h-[80vh] p-4 rounded-xl border-b-4 border-sky-500"
      >
        <div>
          {{ currentProvinceQuestion }} / {{ provinceList.length }} ถูก:
          {{ correctProvince.length }} ผิด: {{ incorrectProvince.length }}
        </div>
        <div class="grid grid-cols-3">
          <div
            v-for="province in provinceList"
            :key="province.PROVINCE_ID"
            :class="{
              'text-green-500': correctProvince
                .map((province) => province[2])
                .includes(province.PROVINCE_CODE),
              'text-red-500': incorrectProvince
                .map((province) => province[2])
                .includes(province.PROVINCE_CODE),
            }"
          >
            {{ province.PROVINCE_NAME }}
          </div>
        </div>
      </div>
    </longdo-map>
  </div>
</template>

<script setup>
import SvgRestart from '@/components/icons/Restart.vue';
import Clock from '@/components/Clock.vue';
import FinishSummary from '@/components/FinishSummary.vue';
import StartGame from '@/components/StartGame.vue';
import HeartContainer from '@/components/HeartContainer.vue';

let map;
let hoveredStateId = null;

const correctProvince = ref([]);
const incorrectProvince = ref([]);
const currentProvinceQuestion = ref(0);
const provinceList = ref([
  {
    PROVINCE_ID: 1,
    PROVINCE_CODE: '10',
    PROVINCE_NAME: 'กรุงเทพมหานคร',
    GEO_ID: 2,
  },
  {
    PROVINCE_ID: 2,
    PROVINCE_CODE: '11',
    PROVINCE_NAME: 'สมุทรปราการ',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 3, PROVINCE_CODE: '12', PROVINCE_NAME: 'นนทบุรี', GEO_ID: 2 },
  { PROVINCE_ID: 4, PROVINCE_CODE: '13', PROVINCE_NAME: 'ปทุมธานี', GEO_ID: 2 },
  {
    PROVINCE_ID: 5,
    PROVINCE_CODE: '14',
    PROVINCE_NAME: 'พระนครศรีอยุธยา',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 6, PROVINCE_CODE: '15', PROVINCE_NAME: 'อ่างทอง', GEO_ID: 2 },
  { PROVINCE_ID: 7, PROVINCE_CODE: '16', PROVINCE_NAME: 'ลพบุรี', GEO_ID: 2 },
  {
    PROVINCE_ID: 8,
    PROVINCE_CODE: '17',
    PROVINCE_NAME: 'สิงห์บุรี',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 9, PROVINCE_CODE: '18', PROVINCE_NAME: 'ชัยนาท', GEO_ID: 2 },
  { PROVINCE_ID: 10, PROVINCE_CODE: '19', PROVINCE_NAME: 'สระบุรี', GEO_ID: 2 },
  { PROVINCE_ID: 11, PROVINCE_CODE: '20', PROVINCE_NAME: 'ชลบุรี', GEO_ID: 5 },
  { PROVINCE_ID: 12, PROVINCE_CODE: '21', PROVINCE_NAME: 'ระยอง', GEO_ID: 5 },
  {
    PROVINCE_ID: 13,
    PROVINCE_CODE: '22',
    PROVINCE_NAME: 'จันทบุรี',
    GEO_ID: 5,
  },
  { PROVINCE_ID: 14, PROVINCE_CODE: '23', PROVINCE_NAME: 'ตราด', GEO_ID: 5 },
  {
    PROVINCE_ID: 15,
    PROVINCE_CODE: '24',
    PROVINCE_NAME: 'ฉะเชิงเทรา',
    GEO_ID: 5,
  },
  {
    PROVINCE_ID: 16,
    PROVINCE_CODE: '25',
    PROVINCE_NAME: 'ปราจีนบุรี',
    GEO_ID: 5,
  },
  { PROVINCE_ID: 17, PROVINCE_CODE: '26', PROVINCE_NAME: 'นครนายก', GEO_ID: 2 },
  { PROVINCE_ID: 18, PROVINCE_CODE: '27', PROVINCE_NAME: 'สระแก้ว', GEO_ID: 5 },
  {
    PROVINCE_ID: 19,
    PROVINCE_CODE: '30',
    PROVINCE_NAME: 'นครราชสีมา',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 20,
    PROVINCE_CODE: '31',
    PROVINCE_NAME: 'บุรีรัมย์',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 21,
    PROVINCE_CODE: '32',
    PROVINCE_NAME: 'สุรินทร์',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 22,
    PROVINCE_CODE: '33',
    PROVINCE_NAME: 'ศรีสะเกษ',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 23,
    PROVINCE_CODE: '34',
    PROVINCE_NAME: 'อุบลราชธานี',
    GEO_ID: 3,
  },
  { PROVINCE_ID: 24, PROVINCE_CODE: '35', PROVINCE_NAME: 'ยโสธร', GEO_ID: 3 },
  { PROVINCE_ID: 25, PROVINCE_CODE: '36', PROVINCE_NAME: 'ชัยภูมิ', GEO_ID: 3 },
  {
    PROVINCE_ID: 26,
    PROVINCE_CODE: '37',
    PROVINCE_NAME: 'อำนาจเจริญ',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 27,
    PROVINCE_CODE: '39',
    PROVINCE_NAME: 'หนองบัวลำภู',
    GEO_ID: 3,
  },
  { PROVINCE_ID: 28, PROVINCE_CODE: '40', PROVINCE_NAME: 'ขอนแก่น', GEO_ID: 3 },
  {
    PROVINCE_ID: 29,
    PROVINCE_CODE: '41',
    PROVINCE_NAME: 'อุดรธานี',
    GEO_ID: 3,
  },
  { PROVINCE_ID: 30, PROVINCE_CODE: '42', PROVINCE_NAME: 'เลย', GEO_ID: 3 },
  { PROVINCE_ID: 31, PROVINCE_CODE: '43', PROVINCE_NAME: 'หนองคาย', GEO_ID: 3 },
  {
    PROVINCE_ID: 32,
    PROVINCE_CODE: '44',
    PROVINCE_NAME: 'มหาสารคาม',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 33,
    PROVINCE_CODE: '45',
    PROVINCE_NAME: 'ร้อยเอ็ด',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 34,
    PROVINCE_CODE: '46',
    PROVINCE_NAME: 'กาฬสินธุ์',
    GEO_ID: 3,
  },
  { PROVINCE_ID: 35, PROVINCE_CODE: '47', PROVINCE_NAME: 'สกลนคร', GEO_ID: 3 },
  { PROVINCE_ID: 36, PROVINCE_CODE: '48', PROVINCE_NAME: 'นครพนม', GEO_ID: 3 },
  {
    PROVINCE_ID: 37,
    PROVINCE_CODE: '49',
    PROVINCE_NAME: 'มุกดาหาร',
    GEO_ID: 3,
  },
  {
    PROVINCE_ID: 38,
    PROVINCE_CODE: '50',
    PROVINCE_NAME: 'เชียงใหม่',
    GEO_ID: 1,
  },
  { PROVINCE_ID: 39, PROVINCE_CODE: '51', PROVINCE_NAME: 'ลำพูน', GEO_ID: 1 },
  { PROVINCE_ID: 40, PROVINCE_CODE: '52', PROVINCE_NAME: 'ลำปาง', GEO_ID: 1 },
  {
    PROVINCE_ID: 41,
    PROVINCE_CODE: '53',
    PROVINCE_NAME: 'อุตรดิตถ์',
    GEO_ID: 1,
  },
  { PROVINCE_ID: 42, PROVINCE_CODE: '54', PROVINCE_NAME: 'แพร่', GEO_ID: 1 },
  { PROVINCE_ID: 43, PROVINCE_CODE: '55', PROVINCE_NAME: 'น่าน', GEO_ID: 1 },
  { PROVINCE_ID: 44, PROVINCE_CODE: '56', PROVINCE_NAME: 'พะเยา', GEO_ID: 1 },
  {
    PROVINCE_ID: 45,
    PROVINCE_CODE: '57',
    PROVINCE_NAME: 'เชียงราย',
    GEO_ID: 1,
  },
  {
    PROVINCE_ID: 46,
    PROVINCE_CODE: '58',
    PROVINCE_NAME: 'แม่ฮ่องสอน',
    GEO_ID: 1,
  },
  {
    PROVINCE_ID: 47,
    PROVINCE_CODE: '60',
    PROVINCE_NAME: 'นครสวรรค์',
    GEO_ID: 2,
  },
  {
    PROVINCE_ID: 48,
    PROVINCE_CODE: '61',
    PROVINCE_NAME: 'อุทัยธานี',
    GEO_ID: 2,
  },
  {
    PROVINCE_ID: 49,
    PROVINCE_CODE: '62',
    PROVINCE_NAME: 'กำแพงเพชร',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 50, PROVINCE_CODE: '63', PROVINCE_NAME: 'ตาก', GEO_ID: 4 },
  { PROVINCE_ID: 51, PROVINCE_CODE: '64', PROVINCE_NAME: 'สุโขทัย', GEO_ID: 2 },
  {
    PROVINCE_ID: 52,
    PROVINCE_CODE: '65',
    PROVINCE_NAME: 'พิษณุโลก',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 53, PROVINCE_CODE: '66', PROVINCE_NAME: 'พิจิตร', GEO_ID: 2 },
  {
    PROVINCE_ID: 54,
    PROVINCE_CODE: '67',
    PROVINCE_NAME: 'เพชรบูรณ์',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 55, PROVINCE_CODE: '70', PROVINCE_NAME: 'ราชบุรี', GEO_ID: 4 },
  {
    PROVINCE_ID: 56,
    PROVINCE_CODE: '71',
    PROVINCE_NAME: 'กาญจนบุรี',
    GEO_ID: 4,
  },
  {
    PROVINCE_ID: 57,
    PROVINCE_CODE: '72',
    PROVINCE_NAME: 'สุพรรณบุรี',
    GEO_ID: 2,
  },
  { PROVINCE_ID: 58, PROVINCE_CODE: '73', PROVINCE_NAME: 'นครปฐม', GEO_ID: 2 },
  {
    PROVINCE_ID: 59,
    PROVINCE_CODE: '74',
    PROVINCE_NAME: 'สมุทรสาคร',
    GEO_ID: 2,
  },
  {
    PROVINCE_ID: 60,
    PROVINCE_CODE: '75',
    PROVINCE_NAME: 'สมุทรสงคราม',
    GEO_ID: 2,
  },
  {
    PROVINCE_ID: 61,
    PROVINCE_CODE: '76',
    PROVINCE_NAME: 'เพชรบุรี',
    GEO_ID: 4,
  },
  {
    PROVINCE_ID: 62,
    PROVINCE_CODE: '77',
    PROVINCE_NAME: 'ประจวบคีรีขันธ์',
    GEO_ID: 4,
  },
  {
    PROVINCE_ID: 63,
    PROVINCE_CODE: '80',
    PROVINCE_NAME: 'นครศรีธรรมราช',
    GEO_ID: 6,
  },
  { PROVINCE_ID: 64, PROVINCE_CODE: '81', PROVINCE_NAME: 'กระบี่', GEO_ID: 6 },
  { PROVINCE_ID: 65, PROVINCE_CODE: '82', PROVINCE_NAME: 'พังงา', GEO_ID: 6 },
  { PROVINCE_ID: 66, PROVINCE_CODE: '83', PROVINCE_NAME: 'ภูเก็ต', GEO_ID: 6 },
  {
    PROVINCE_ID: 67,
    PROVINCE_CODE: '84',
    PROVINCE_NAME: 'สุราษฎร์ธานี',
    GEO_ID: 6,
  },
  { PROVINCE_ID: 68, PROVINCE_CODE: '85', PROVINCE_NAME: 'ระนอง', GEO_ID: 6 },
  { PROVINCE_ID: 69, PROVINCE_CODE: '86', PROVINCE_NAME: 'ชุมพร', GEO_ID: 6 },
  { PROVINCE_ID: 70, PROVINCE_CODE: '90', PROVINCE_NAME: 'สงขลา', GEO_ID: 6 },
  { PROVINCE_ID: 71, PROVINCE_CODE: '91', PROVINCE_NAME: 'สตูล', GEO_ID: 6 },
  { PROVINCE_ID: 72, PROVINCE_CODE: '92', PROVINCE_NAME: 'ตรัง', GEO_ID: 6 },
  { PROVINCE_ID: 73, PROVINCE_CODE: '93', PROVINCE_NAME: 'พัทลุง', GEO_ID: 6 },
  { PROVINCE_ID: 74, PROVINCE_CODE: '94', PROVINCE_NAME: 'ปัตตานี', GEO_ID: 6 },
  { PROVINCE_ID: 75, PROVINCE_CODE: '95', PROVINCE_NAME: 'ยะลา', GEO_ID: 6 },
  {
    PROVINCE_ID: 76,
    PROVINCE_CODE: '96',
    PROVINCE_NAME: 'นราธิวาส',
    GEO_ID: 6,
  },
  { PROVINCE_ID: 77, PROVINCE_CODE: '38', PROVINCE_NAME: 'บึงกาฬ', GEO_ID: 3 },
]);
const randomProvinceList = ref([]);
const attempt = ref(0);
const heartContainer = ref(undefined);
const isFinish = ref(false);
const isMapLoaded = ref(false);
const mapUrl = ref('');
const score = ref(0);
const isHome = ref(true);

const stopwatchRef = ref(null);

const boundsThailand = [
  [97.34466, 5.61],
  [105.6393, 20.4632],
];

// colors
const colors = {
  init: '#FABC3F',
  border: '#FFF8DB',
  borderHover: '#FFF8DB',
  correct: '#7ABA78',
  incorrect: '#D37676',
  background: '#1E2A5E',
};

const clickProvince = ref('');
const onLoad = async (mapLoad) => {
  map = mapLoad;
  map.Ui.Zoombar.visible(false);
  map.Ui.Geolocation.visible(false);
  map.Ui.Terrain.visible(false);
  map.Ui.DPad.visible(false);
  map.Ui.LayerSelector.visible(false);
  map.Ui.Crosshair.visible(false);
  map.Ui.Scale.visible(false);
  map.Renderer.dragRotate.disable();
  map.Renderer.doubleClickZoom.disable();
  map.Renderer.boxZoom.disable();
  // map.Layers.setBase(window.longdo.Layers.CLEAR);

  const backgroundOnlyStyle = {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': colors.background,
        },
      },
    ],
  };
  map.Renderer.setStyle(backgroundOnlyStyle);

  map.Event.bind(longdo.EventName.BeforeContextmenu, (e) => {
    console.log(e);
    e.preventDefault();
  });

  map.Renderer.fitBounds(boundsThailand, {
    padding: { top: 150, bottom: 100, left: 15, right: 15 },
  });
  setTimeout(async () => {
    map.zoomRange({ min: map.zoom(), max: 8 });
    const boundMap = map.bound();
    map.Renderer.setMaxBounds([
      [boundMap.minLon, boundMap.minLat],
      [boundMap.maxLon, boundMap.maxLat],
    ]);

    randomProvince();
    await readFile();
  }, 500);
  isMapLoaded.value = true;
};
const newGame = () => {
  attempt.value = 0;
  stopwatchRef.value.resetStopwatch();
  stopwatchRef.value.startStopwatch();
  isHome.value = false;
  isFinish.value = false;
  randomProvince();
  correctProvince.value = [];
  incorrectProvince.value = [];
  currentProvinceQuestion.value = 0;
  map.Renderer.setPaintProperty('state-fills', 'fill-color', [
    'case',
    ['any', ...correctProvince.value],
    colors.correct,
    [
      'case',
      ['any', ...incorrectProvince.value],
      colors.incorrect,
      colors.init,
    ],
  ]);
};
const finishGame = () => {
  getLayerImage();
  stopwatchRef.value.startStopwatch();
  isFinish.value = true;
  setTimeout(() => {
    const scoreInterval = setInterval(() => {
      if (score.value < correctProvince.value.length) score.value += 1;
      else clearInterval(scoreInterval);
    }, 20);
  }, 500);
};

const readFile = async () => {
  const response = await $fetch('/geojson/thailand-provinces.geojson');
  console.log(response);
  addLayer(response);
};
const addLayer = (geojson) => {
  map.Renderer.addSource('states', {
    type: 'geojson',
    generateId: true,
    data: geojson,
  });

  map.Renderer.addLayer({
    id: 'state-fills',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': colors.init,
      'fill-opacity': 1,
      'fill-color-transition': {
        duration: 3700,
      },
    },
  });

  map.Renderer.addLayer({
    id: 'state-border',
    type: 'line',
    source: 'states',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        colors.border,
        colors.borderHover,
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        6,
        3,
      ],
      'line-opacity': 1,
    },
  });

  map.Renderer.on('click', 'state-fills', stateFillsClick);
  map.Renderer.on('mousemove', 'state-fills', stateFillsMouseMove);
  map.Renderer.on('mouseenter', 'state-fills', () => {
    map.Renderer.getCanvas().style.cursor = 'pointer';
  });
  map.Renderer.on('mouseleave', 'state-fills', () => {
    map.Renderer.getCanvas().style.cursor = '';
  });
  map.Renderer.on('mouseleave', 'state-fills', stateFillsMouseLeave);
};

const stateFillsClick = (e) => {
  console.log(e.features[0].properties);
  if (
    e.features[0].properties.pro_code ===
    provinceList.value[randomProvinceList.value[currentProvinceQuestion.value]]
      .PROVINCE_CODE
  ) {
    onCorrect(e);
  } else {
    onIncorrect(e);
  }
  if (currentProvinceQuestion.value === provinceList.value.length) {
    finishGame();
    clickProvince.value = e.features[0].properties.pro_th;
  }
};
const onCorrect = (e) => {
  console.log('equal');
  correctProvince.value.push([
    '==',
    ['get', 'pro_code'],
    e.features[0].properties.pro_code,
  ]);
  map.Renderer.setPaintProperty('state-fills', 'fill-color', [
    'case',
    ['any', ...correctProvince.value],
    colors.correct,
    [
      'case',
      ['any', ...incorrectProvince.value],
      colors.incorrect,
      colors.init,
    ],
  ]);
  currentProvinceQuestion.value += 1;
  refillHeart();
};
const onIncorrect = (e) => {
  console.log(e);
  heartContainer.value.classList.add('apply-shake');
  setTimeout(() => {
    heartContainer.value.classList.remove('apply-shake');
  }, 1000);

  var popupProvince = new longdo.Popup(
    { lat: e.lngLat.lat, lon: e.lngLat.lng },
    {
      title: e.features[0].properties.pro_th,
      closable: false,
      // html: `<div class="bg-white p-4 rounded-xl popup-title">${e.features[0].properties.pro_th}</div>`,
    }
  );

  map.Overlays.add(popupProvince);
  setTimeout(() => {
    map.Overlays.remove(popupProvince);
  }, 1000);

  attempt.value += 1;
  if (attempt.value === 3) {
    incorrectProvince.value.push([
      '==',
      ['get', 'pro_code'],
      provinceList.value[
        randomProvinceList.value[currentProvinceQuestion.value]
      ].PROVINCE_CODE,
    ]);
    map.Renderer.setPaintProperty('state-fills', 'fill-color', [
      'case',
      ['any', ...correctProvince.value],
      colors.correct,
      [
        'case',
        ['any', ...incorrectProvince.value],
        colors.incorrect,
        colors.init,
      ],
    ]);
    currentProvinceQuestion.value += 1;
    refillHeart();
  }
};
const refillHeart = () => {
  let attempInterval;
  if (attempt.value > 0) {
    console.log(attempt.value);
    attempInterval = setInterval(() => {
      attempt.value -= attempt.value > 0 ? 1 : 0;
      if (attempt.value <= 0) {
        clearInterval(attempInterval);
      }
    }, 100);
  }
};
const stateFillsMouseMove = (e) => {
  if (e.features.length > 0) {
    if (hoveredStateId) {
      map.Renderer.setFeatureState(
        { source: 'states', id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = e.features[0].id;
    map.Renderer.setFeatureState(
      { source: 'states', id: hoveredStateId },
      { hover: true }
    );
  }
};
const stateFillsMouseLeave = (e) => {
  if (hoveredStateId) {
    map.Renderer.setFeatureState(
      { source: 'states', id: hoveredStateId },
      { hover: false }
    );
  }
  hoveredStateId = null;
};
function getRandomUniqueArray(size, max) {
  // Create an array of all numbers from 0 to max
  const allNumbers = Array.from({ length: max + 1 }, (_, index) => index);

  // Shuffle the array
  for (let i = allNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
  }

  // Return the first 'size' elements from the shuffled array
  return allNumbers.slice(0, size);
}
const randomProvince = () => {
  randomProvinceList.value = getRandomUniqueArray(
    provinceList.value.length,
    76
  );
  console.log(randomProvinceList.value);
  console.log(provinceList.value);
  currentProvinceQuestion.value = 0;
};
const takeScreenshot = async (layerIds) => {
  console.log('take screenshot');

  return new Promise((resolve, reject) => {
    // Retrieve the map's layers using the Renderer
    const layers = map.Renderer.getStyle().layers; // You may still need to use map.getStyle() to get the layer details
    const visibility = {};

    // Store the original visibility of each layer and hide layers not in the specified layerIds array
    layers.forEach((layer) => {
      if (!layerIds.includes(layer.id)) {
        visibility[layer.id] = map.Renderer.getLayoutProperty(
          layer.id,
          'visibility'
        );
        map.Renderer.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });

    map.Renderer.fitBounds(boundsThailand, { padding: 0, linear: true });

    // Set the background to transparent
    map.Renderer.setPaintProperty(
      'background',
      'background-color',
      'rgba(0,0,0,0)'
    );

    setTimeout(() => {
      map.Renderer.once('render', async function () {
        console.log('Render completed');

        // Capture the screenshot from the canvas
        const dataUrl = map.Renderer.getCanvas().toDataURL();

        // Restore the original visibility of each layer
        layers.forEach((layer) => {
          if (!layerIds.includes(layer.id)) {
            map.Renderer.setLayoutProperty(
              layer.id,
              'visibility',
              visibility[layer.id]
            );
          }
        });

        // Restore the background color
        map.Renderer.setPaintProperty(
          'background',
          'background-color',
          'original_color_value'
        );

        resolve(dataUrl);
      });

      // Trigger a render to apply changes
      map.Renderer.setBearing(map.Renderer.getBearing());
    }, 1000);
    // Trigger render and wait for completion
  });
};
const getLayerImage = async () => {
  console.log(map.Layers.list());
  const dataUrl = await takeScreenshot(['state-fills', 'state-border']);

  mapUrl.value = dataUrl;
  // const link = document.createElement('a');
  // link.href = dataUrl;
  // link.download = 'map.png';
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};
</script>

<style>
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.apply-shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.ldmap-popup_title,
.ldmap-popup_detail,
.maplibregl-popup.mapboxgl-popup {
  font-family: 'Prompt', sans-serif;
}
</style>
