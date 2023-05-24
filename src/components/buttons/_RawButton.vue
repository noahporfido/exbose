<template>
  <component :is="isLink() ? RouterLink : 'button'" :to="{ name: routeName }">
    <span v-if="icon" class="material-icons-outlined text-base">{{
      icon
    }}</span>
    <div class="uppercase">
      <slot />
    </div>
  </component>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'

interface Props {
  routeName?: string
  callback?: Function
  icon?: string
}
const props = defineProps<Props>()

const isLink = function (): boolean {
  return props.routeName != undefined
}
</script>
