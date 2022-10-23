<template>
  <div class="app-container pa1">
    <div
      v-for="item in everythingCombined"
      class="scrapbook-item overflow-hidden black"
    >
      <div v-if="item.url && item.url.split('.')[0] === 'jpg'">
        <img :src="item.url" class="w-100" />
      </div>

      <div v-if="item.commit" class="red f7 lh-solid">
        <strong>
          {{ item.url.split('/')[4] }}/
          {{ item.url.split('/')[5] }}
        </strong>
        {{ item.commit.message }}
      </div>

      <div v-if="item.text">
        <p
          class="f7 lh-solid i blue pa2 pv3 ba b--light-gray br3 overflow-hidden tj measure bg-white"
        >
          <!-- tweet -->
          <strong class="db pv2">@mrejfox</strong>
          {{ item.text }}
        </p>
      </div>

      <div v-if="item.description">
        <p class="f6 sans-serif bg-dark-gray br3 white pa2 overflow-hidden">
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
import * as d3 from 'd3';
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

const { data: commits, isFinished: finished4 } = useAxios(
  '/data/commits_all.json',
  { method: 'GET' },
  instance
);

const everythingCombined = computed(() => {
  if (
    !finished1.value ||
    !finished2.value ||
    !finished3.value ||
    !finished4.value
  )
    return;

  const filteredTweets = tweets.value.filter((t) => {
    return t.public_metrics.like_count > 3;
  });

  const filteredBookmarks = pinboardBookmarks.value.filter((b) => {
    // return b.toRead === 'yes';
    // return true;
    return b.tags.length > 1;
  });

  const reDatedCommits = commits.value.map((c) => {
    const time = new Date(c.commit.committer.date);
    return {
      ...c,
      time,
    };
  });

  return [
    ...arenaBlocks.value,
    ...filteredBookmarks,
    ...filteredTweets,
    ...reDatedCommits,
  ]
    .map((d) => {
      const time = d.created_at ? d.created_at : d.time;
      return {
        time,
        ...d,
      };
    })
    .sort((a, b) => {
      // const dateA = a.created_at ? a.created_at : a.time;
      // const dateB = b.created_at ? b.created_at : b.time;
      const dateA = a.time;
      const dateB = b.time;
      return new Date(dateA) > new Date(dateB) ? -1 : 1;
    })
    .slice(0, 250);
});

const everythingGroupedByMonth = computed(() => {
  console.log('grouping');
  return d3.group(everythingCombined, (d) => {
    const date = d.created_at ? d.created_at : d.time;
    const dDate = new Date(date);
    console.log('month?', { dDate }, d3.timeMonth(dDate));
    return d3.timeMonth(dDate);
  });
});

onMounted(() => {
  console.log('mounted');
  console.log({ arenaBlocks, pinboardBookmarks, tweets });

  console.log({ everythingGroupedByMonth });
});
</script>

<style scoped>
.app-container {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(29%, 1fr));
  grid-auto-rows: minmax(5rem, auto);
  grid-auto-flow: dense;
}

.scrapbook-item {
  max-height: 15rem;
  grid-row: span 1;
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
