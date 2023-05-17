<template>
  <div class="h-screen w-screen bg-red-500">
    <NavBar />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import NavBar from "../components/NavBar.vue";
</script>
