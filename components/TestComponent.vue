<template>
    <div>
        <h1 class="red">Hello {{world}}</h1>
    </div>
</template>

<script setup>
const worldAlternatives = ['world', 'universe', 'everything'];

const randomWord = worldAlternatives[Math.floor(Math.random() * worldAlternatives.length)];
const world = ref(randomWord)
</script>

<style scoped>

</style>