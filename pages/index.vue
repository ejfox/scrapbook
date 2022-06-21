<template>
    <div>
        <h1>Index</h1>
        <TestComponent />
    </div>
</template>

<script setup>
import TestComponent from '../components/TestComponent.vue';
onMounted(() => {
    console.log('mounted');
});
</script>

<style lang="scss" scoped>

</style>