<template>
  <div>
    <h1>Index</h1>
    <GitHubIssues />
  </div>
</template>

<script setup>
import TestComponent from '../components/TestComponent.vue'
import GitHubIssues from '../components/GitHubIssues.vue'
onMounted(() => {
  console.log('mounted')
})
</script>

<style lang="scss" scoped></style>
