<template>
  <div class="app-container pa4">
    <!-- <div class="important-tags tl">
      <div
        v-for="tag in importantTags"
        :key="tag"
        class="dib pa1"
        @click="setFocusTags([tag])"
      >
        {{ tag }}
      </div>
    </div> -->

    <div class="important-tags tl">
      <div
        v-for="tag in sortedTagMap"
        :key="tag.tag"
        :class="['dib pa1', tag.tagIDs.length > 25 ? 'o-50' : 'o-10']"
        @click="setFocusTags([tag.tag])"
      >
        {{ tag.tag }} ({{ tag.tagIDs.length }})
      </div>
    </div>

    <div class="focus-tags fixed bottom-4 left-4 bg-white dark-gray f4">
      <div
        v-for="tag in state.focusedTags"
        :key="tag"
        class="dib pa1"
        @click="removeFocusTags(tag)"
      >
        {{ tag }}
      </div>
    </div>
    <div class="list-container tc">
      <div
        v-for="[key, week] in everythingGroupedByWeek"
        class="mv4 w-100 w-third-ns mr4 dib v-top tl"
      >
        <h2 class="f3 bb o-20">Week of {{ format(key, 'MMM do, yyyy') }}</h2>
        <div
          v-for="item in week"
          :key="item.id"
          :id="'item-' + item.id"
          class="scrapbook-item"
          :style="{
            opacity: itemOpacity(item),
            display: isItemFocused(item) ? 'block' : 'none',
          }"
        >
          <ScrapbookItem
            :item="item"
            class="mb3"
            @setFocusTags="setFocusTags"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import TestComponent from '../components/TestComponent.vue';
import GitHubIssues from '../components/GitHubIssues.vue';
import PinboardBookmarks from '../components/PinboardBookmarks.vue';
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
import { format } from 'date-fns';

const importantTags = ref([
  '3d',
  'activism',
  'arduino',
  'art',
  'cli',
  'cooking',
  'crypto',
  'd3',
  'data',
  'datajournalism',
  'dataset',
  'dataviz',
  'design',
  'elections',
  'Fashion',
  'food',
  'games',
  'github',
  'hackers',
  'hacking',
  'howto',
  'inspiration',
  'javascript',
  'journalism',
  'machinelearning',
  'mapping',
  'maps',
  'music',
  'node',
  'oakland',
  'occupy',
  'photography',
  'pico8',
  'police',
  'politics',
  'programming',
  'protest',
  'raspberrypi',
  'recipe',
  'reference',
  'research',
  'resource',
  'tech',
  'tool',
  'video',
  'visualization',
  'vj',
  'webdesign',
  'writing',
  'youtube',
]);

const axiosInstance = axios.create({
  baseURL: '',
});

// const { data: arenaBlocks, isFinished: finished1 } = useAxios(
//   '/data/arena_blocks_all.json',
//   { method: 'GET' },
//   axiosInstance
// );

// const { data: pinboardBookmarks, isFinished: finished2 } = useAxios(
//   '/data/pinboard_bookmarks_all.json',
//   { method: 'GET' },
//   axiosInstance
// );

// const { data: tweets, isFinished: finished3 } = useAxios(
//   '/data/tweets_all.json',
//   { method: 'GET' },
//   axiosInstance
// );

// const { data: commits, isFinished: finished4 } = useAxios(
//   '/data/commits_all.json',
//   { method: 'GET' },
//   axiosInstance
// );

// get tagMap from /data/tagMap.json
const { data: tagMap, isFinished: finished5 } = useAxios(
  '/data/tagMap.json',
  { method: 'GET' },
  axiosInstance
);

const sortedTagMap = computed(() => {
  if (!finished5.value) return [];
  return Object.entries(tagMap.value)
    .map(([tag, tagIDs]) => ({
      tag,
      tagIDs,
    }))
    .sort((a, b) => b.tagIDs.length - a.tagIDs.length)
    .slice(0, 50);
});

// const everythingCombined = computed(() => {
//   if (
//     !finished1.value ||
//     !finished2.value ||
//     !finished3.value ||
//     !finished4.value
//   )
//     return;

//   return [
//     ...mappedArenaBlocks,
//     ...filteredBookmarks,
//     ...filteredTweets,
//     ...reDatedCommits,
//   ]
//     .map((d) => {
//       const time = d.created_at ? d.created_at : d.time;
//       return {
//         time: new Date(time),
//         ...d,
//       };
//     })
//     .sort((a, b) => {
//       // const dateA = a.created_at ? a.created_at : a.time;
//       // const dateB = b.created_at ? b.created_at : b.time;
//       const dateA = a.time;
//       const dateB = b.time;
//       return new Date(dateA) > new Date(dateB) ? -1 : 1;
//     })
//     .slice(0, 250);
// });

const { data: everythingCombined, isFinished: finishedEverything } = useAxios(
  '/data/allData.json',
  { method: 'GET' },
  axiosInstance
);

const everythingGroupedByWeek = computed(() => {
  if (!finishedEverything.value) return;
  let everything = everythingCombined.value;
  // filter out things with no tags
  everything = everything.filter((d) => d.tags && d.tags.length > 0);

  // sort everything by timestamp
  everything = everything.sort((a, b) => {
    const dateA = a.timestamp;
    const dateB = b.timestamp;
    return new Date(dateA) > new Date(dateB) ? -1 : 1;
  });

  return d3.group(everything, (d) => {
    return d3.timeWeek(new Date(d.timestamp));
  });
});

onMounted(() => {
  console.log('mounted');
  console.log({ tagMap });
});

const state = reactive({
  focusedTags: [],
});

function setFocusTags(focusTagArray) {
  console.log('setting focus tags', focusTagArray);
  state.focusedTags = focusTagArray;
}

function addFocusTag(tag) {
  state.focusedTags.push(tag);
}

function removeFocusTag(tag) {
  state.focusedTags = state.focusedTags.filter((t) => t !== tag);
}

function clearFocusTags() {
  state.focusedTags = [];
}

const unfocusedOpacity = 0.05;
const focusedOpacity = 1;

function isItemFocused(item) {
  if (!state.focusedTags.length) return true;
  if (!item.tags) return false;
  // if item.tags contains focusedTag
  if (state.focusedTags.some((t) => item.tags.includes(t))) return true;
  else return false;
}

// re-write to handle multiple focus tags
function itemOpacity(item) {
  if (!state.focusedTags.length) return focusedOpacity;
  if (!item.tags) return unfocusedOpacity;
  // if item.tags contains focusedTag
  if (state.focusedTags.some((t) => item.tags.includes(t)))
    return focusedOpacity;
  else return unfocusedOpacity;
}
</script>

<style>
.app-container {
  /* font-size: 10px; */
}
.list-container {
  /* display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  grid-template-rows: masonry; */
}

.scrapbook-item {
  /* aspect-ratio: 1/0.5; */
  /* display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  transition: opacity 225ms cubic-bezier(0.77, 0, 0.465, 0.69);
}

svg {
  /* max-height: 1em;
  display: inline-block; */
}

.scrapbook-item img {
  /* aspect-ratio: 16/9; */
  /* max-height: 2rem; */
  /* width: auto; */
}

@media (prefers-color-scheme: dark) {
  .app-container {
    background-color: #333 !important;
    color: #fff !important;
  }
}

@media (prefers-color-scheme: light) {
  .app-container {
    background-color: #fff !important;
    color: #333 !important;
  }
}
</style>
