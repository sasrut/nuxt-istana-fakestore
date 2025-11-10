<template>
  <button
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="computedClasses"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
  
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'outline' }, // 'primary' | 'outline' | 'ghost'
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])

const computedClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700'
    case 'ghost':
      return 'bg-transparent text-gray-700'
    default:
      return 'border text-gray-700 hover:shadow-sm'
  }
})
</script>

<style scoped>
</style>

