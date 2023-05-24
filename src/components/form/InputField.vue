<template>
  <div>
    <label class="text-gray-700">{{ label }}</label>
    <input
      v-model="value"
      :placeholder="placeholder"
      @input="handleInput"
      class="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface InputProps {
  label: string;
  placeholder: string;
  initialValue?: string;
}

const props = defineProps<InputProps>();

const value = ref(props.initialValue || "");

const handleInput = (event: Event) => {
  const inputValue = (event.target as HTMLInputElement).value;
  value.value = inputValue;
  emit("update:modelValue", inputValue);
};

const emit = defineEmits(["update:modelValue"]);
</script>
