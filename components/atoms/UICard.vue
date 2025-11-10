<template>
  <div
    class="hover:bg-gray-50 rounded-lg border border-gray-200 bg-white shadow p-4 flex gap-2 transition flex-col"
    :class="[computedClasses, {'opacity-60': busy}]"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  busy: {
    type: Boolean,
    default: false
  },
  layout: {
    type: String,
    default: 'vertical' // or 'horizontal'
  }
})

const computedClasses = computed(() => {
  switch (props.layout) {
    case 'vertical':
      return 'min-w-[250px] max-w-[300px] h-full min-h-[430px] flex-1'
    case 'horizontal':
      return 'min-h-[300px] max-h-[350px] w-full min-w-[430px]'
    default:
      return 'flex-col min-w-[250px]'
  }
})
</script>
