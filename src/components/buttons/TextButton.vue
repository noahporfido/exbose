<template>
  <button
    type="button"
    :disabled="loading || disabled"
    class="flex flex-row rounded-full font-medium h-10 items-center px-4 relative whitespace-nowrap"
    :class="[
      !secondary &&
        'text-gray-50 disabled:bg-gray-300 disabled:hover:bg-gray-300',
      !secondary && !warning && 'bg-gray-900  hover:bg-gray-700',
      secondary &&
        'border border-gray-900 disabled:border-gray-400 text-gray-900 disabled:text-gray-400 hover:bg-gray-100 disabled:hover:bg-transparent',
      warning &&
        secondary &&
        'border-feuerbusch-40 hover:bg-feuerbusch-99 text-feuerbusch-40',
      warning && !secondary && 'bg-feuerbusch-40 hover:bg-feuerbusch-60 ',
    ]"
    @click="onClick()"
  >
    <span v-if="icon" class="material-icons-outlined -ml-1 pr-2">{{
      icon
    }}</span>
    <span :class="loading ? 'opacity-0' : 'opacity-100'">
      <slot />
    </span>
    <!-- <LoadingSpinner v-if="loading" class="absolute left-1/2 -translate-x-1/2" /> -->
  </button>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

interface Props {
  routeName?: string;
  title?: string;
  callback?: () => void;
  icon?: string;
  secondary?: boolean;
  warning?: boolean;
  loading?: boolean;
  disabled?: boolean;
  params?: { any: string };
}
const props = defineProps<Props>();

const onClick = (): void => {
  if (!props.callback) {
    router.push({ name: props.routeName, params: props.params });
  } else {
    props.callback();
  }
};
</script>
