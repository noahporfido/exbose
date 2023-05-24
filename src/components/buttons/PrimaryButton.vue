<template>
  <RawButton
    :route-name="routeName"
    :icon="icon"
    class="bg-black text-white hover:bg-gray-700 rounded-xl p-2 flex items-center space-x-2"
  >
    <slot />
  </RawButton>
</template>

<script lang="ts" setup>
import RawButton from './_RawButton.vue'

interface Props {
  routeName?: string
  icon?: string
}
defineProps<Props>()
</script>
