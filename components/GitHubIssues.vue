<template>
  <div>Issues</div>
</template>

<script setup>
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';

const $apiGithub = axios.create({
  baseURL: 'https://api.github.com',
});

const { data, isFinished } = useAxios('/', { method: 'GET' }, $apiGithub);

const { data: zen } = useAxios('/zen', { method: 'GET' }, $apiGithub);

console.log({ data });
// const $apiGithub = useNuxtApp();
onMounted(() => {
  console.log('mounted', { data });
  console.log({ zen });
});
</script>

<style lang="scss" scoped></style>
