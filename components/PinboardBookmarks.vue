<template>
  <div>Issues</div>
</template>

<script setup>
import * as _ from 'lodash';
import pbManifest from '~/public/data/pinboard_manifest.json';

const allBookmarks = [];

// for every date in pubManifest.dates there is a corresponding data file
// with the format pinboard_bookmarks_YYYY-MM-DD.json
onMounted(() => {
  // console.log('mounted', { pbManifest });
  // console.log({ allBookmarks });
});
</script>

<style lang="scss" scoped></style>
