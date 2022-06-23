<template>
  <div>
    <div
      v-for="item in everythingCombined"
      class="w-10 h4 overflow-hidden black pa2 dib v-top"
    >
      <div v-if="item.url">
        <img :src="item.url" class="w-100" />
      </div>

      <div v-if="item.text">
        <p class="f7 lh-solid i h4 blue pa1 overflow-hidden">
          {{ item.text }}
        </p>
      </div>

      <div v-if="item.description">
        <p class="f6 sans-serif h4 bg-dark-gray white pa1 overflow-hidden">
          {{ item.description }}
        </p>
      </div>

      <div v-if="item.image">
        <img :src="item.image.square.url" class="w-100" />
      </div>

      <!-- <div v-if="item.image">
        <img :src="item.image.thumb.url" class="w-100" />
      </div> -->

      <!-- {{ JSON.stringify(item) }} -->
    </div>
  </div>
</template>

<script setup>
import TestComponent from '../components/TestComponent.vue';
import GitHubIssues from '../components/GitHubIssues.vue';
import PinboardBookmarks from '../components/PinboardBookmarks.vue';
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';

const instance = axios.create({
  baseURL: '',
});

const { data: arenaBlocks, isFinished: finished1 } = useAxios(
  '/data/arena_blocks_all.json',
  { method: 'GET' },
  instance
);

const { data: pinboardBookmarks, isFinished: finished2 } = useAxios(
  '/data/pinboard_bookmarks_all.json',
  { method: 'GET' },
  instance
);

const { data: tweets, isFinished: finished3 } = useAxios(
  '/data/tweets_all.json',
  { method: 'GET' },
  instance
);

const everythingCombined = computed(() => {
  if (!finished1.value && !finished2.value && !finished3.value) return;

  const filteredTweets = tweets.value.filter((t) => {
    return t.public_metrics.like_count > 0;
  });

  return [
    ...arenaBlocks.value,
    ...pinboardBookmarks.value,
    ...filteredTweets,
  ].sort((a, b) => {
    const dateA = a.created_at ? a.created_at : a.time;
    const dateB = b.created_at ? b.created_at : b.time;
    return new Date(dateA) > new Date(dateB) ? -1 : 1;
  });
});

onMounted(() => {
  console.log('mounted');
  console.log({ arenaBlocks, pinboardBookmarks, tweets });
});
</script>

<style lang="scss" scoped></style>
