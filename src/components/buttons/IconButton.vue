<template>
  <button
    v-tooltip="tooltip"
    type="button"
    :class="[
      small ? 'h-8 w-8' : 'w-12 h-12',
      color ? 'text-' + color + '-10' : 'text-gray-900',
      color ? 'border-' + color : 'border-gray-900',
      color
        ? 'bg-' + color + '-90 hover:bg-' + color + '-95'
        : 'hover:bg-gray-100 ',
      border ? 'border' : ''
    ]"
    class="rounded-full flex items-center justify-center"
    @click.stop="onClick()"
  >
    <span class="material-icons-outlined">{{ icon }}</span>
  </button>
</template>

<script lang="ts" setup>
import { useRouter, type RouteParamsRaw } from 'vue-router'

interface Props {
  routeName?: string
  params?: RouteParamsRaw
  callback?: () => void
  icon: string
  small?: boolean
  border?: boolean
  color?: string
  tooltip?: string
}
const props = defineProps<Props>()

const router = useRouter()

const onClick = (): void => {
  if (!props.callback) {
    router.push({ name: props.routeName, params: props.params })
  } else {
    props.callback()
  }
}
</script>
