<template>
  <div class="h-screen w-screen overflow-y-auto bg-slate-950 px-20 pb-10">
    <NavBar />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import NavBar from "../components/NavBar.vue";
</script>
