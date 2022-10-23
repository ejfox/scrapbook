<template>
  <div @click="setFocusTags(item)">
    <!-- icons -->
    <div v-if="item.type === 'tweet'" class="dn mb3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="db center iconify iconify--fa6-brands"
        width="28"
        height="32"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 448 512"
      >
        <path
          d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5c0 86.7-66 186.6-186.6 186.6c-37.2 0-71.7-10.8-100.7-29.4c5.3.6 10.4.8 15.8.8c30.7 0 58.9-10.4 81.4-28c-28.8-.6-53-19.5-61.3-45.5c10.1 1.5 19.2 1.5 29.6-1.2c-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1c32.3 39.8 80.8 65.8 135.2 68.6c-9.3-44.5 24-80.6 64-80.6c18.9 0 35.9 7.9 47.9 20.7c14.8-2.8 29-8.3 41.6-15.8c-4.9 15.2-15.2 28-28.8 36.1c13.2-1.4 26-5.1 37.8-10.2c-8.9 13.1-20.1 24.7-32.9 34z"
        ></path>
      </svg>
    </div>
    <div v-else-if="item.type === 'pinboard'" class="dn mb3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="db center iconify iconify--fa6-regular"
        width="24"
        height="32"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 384 512"
      >
        <path
          d="M336 0H48C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93c21.3 11.57 48.1-2.93 48.1-27.63V48c0-26.51-21.5-48-48-48zm0 452l-144-84l-144 84V54c0-3.37 2.63-6 5.1-6h276c4.3 0 6.9 2.63 6.9 6v398z"
        ></path>
      </svg>
    </div>
    <div v-else class="dn mb3"></div>

    <div class="scrapbook-item-internal">
      <!-- tweet -->
      <div v-if="item.type === 'tweet'">
        <!-- tweet -->
        <strong class="w-20 fl">@mrejfox</strong>
        <div v-html="item.text" class="fl w-80 f5"></div>
        <!-- show an image for every media in mediaURLs-->
        <div v-if="item.mediaUrls">
          <div v-if="item.mediaUrls.length > 0">
            <div v-if="item.mediaUrls.length === 1">
              <img
                v-if="item.mediaUrls[0].url"
                :src="item.mediaUrls[0].url"
                class="w-100"
                alt="tweet image"
              />
              <img
                v-else-if="item.mediaUrls[0].preview_image_url"
                :src="item.mediaUrls[0].preview_image_url"
                class="w-100"
                alt="tweet image"
              />
            </div>
            <div v-else-if="item.mediaUrls.length === 2">
              <div class="w-100">
                <img
                  :src="item.mediaUrls[0].url"
                  class="w-50 fl"
                  alt="tweet image"
                />
                <img
                  :src="item.mediaUrls[1].url"
                  class="w-50 fl"
                  alt="tweet image"
                />
              </div>
            </div>

            <div v-else-if="item.mediaUrls.length === 3">
              <div class="w-100">
                <img
                  :src="item.mediaUrls[0].url"
                  class="w-100"
                  alt="tweet image"
                />
                <img
                  :src="item.mediaUrls[1].url"
                  class="w-50 fl"
                  alt="tweet image"
                />
                <img
                  :src="item.mediaUrls[2].url"
                  class="w-50 fl"
                  alt="tweet image"
                />
              </div>
            </div>
            <div v-else>
              <div v-for="media in item.mediaUrls" class="">
                <div v-if="media.type === 'photo'" class="">
                  <img :src="media.url" class="br1 w-25" />
                </div>

                <div v-if="media.type === 'video'">
                  <img :src="media.preview_image_url" class="w-100 br1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- commit -->
      <div v-if="item.type === 'commit'">
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          class="iconify iconify--fa6-brands"
          width="31"
          height="32"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 496 512"
        >
          <path
            fill="currentColor"
            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z"
          ></path>
        </svg> -->
        <!-- first 8 characters of sha -->
        <span class="mr2 o-20">{{ item.sha.substring(0, 8) }}</span>
        <strong>
          {{ item.url.split('/')[4] }}/{{ item.url.split('/')[5] }}
        </strong>
        {{ item.commit.message }}
      </div>

      <!-- bookmark -->
      <div v-if="item.type === 'pinboard'">
        <strong>{{ item.description }}</strong>
      </div>

      <!-- arenaBlock -->
      <div v-if="item.type === 'arena'">
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          class="iconify iconify--fa6-regular"
          width="32"
          height="32"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.5-48-48-48zm295.1-88h-384C28.65 32-.01 60.65-.01 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96c.01-35.35-27.79-64-63.99-64zm16 377.3L326.3 223.4c-2.5-4.6-8.2-7.4-14.3-7.4c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.03 0 .03 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16v313.3z"
          ></path>
        </svg> -->
        <img v-if="item.image" :src="item.image.display.url" class="br1" />
        <!-- if content_html exists, bind it to a div -->
        <div
          v-if="item.content_html.length > 1"
          v-html="item.content_html"
        ></div>
      </div>
    </div>

    <!-- <div v-if="item.timestamp" class="f5 mt3">
      {{ format(new Date(item.timestamp), 'MMMM do') }}
      <strong>{{ format(new Date(item.timestamp), 'p') }}</strong>
    </div>

    <div v-if="item.tags" class="f7 mt3">
      <span
        v-for="tag in item.tags"
        class="br2 bg-white ph2 pv1 black mr2"
        @click="focusTag(tag)"
      >
        {{ tag }}
      </span>
    </div> -->
  </div>
</template>

<script setup>
import { format } from 'date-fns';

const emit = defineEmits(['setFocusTags']);

function setFocusTags(item) {
  if (!item.tags) return;
  emit('setFocusTags', item.tags);
}

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
