<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    @click.self="onBackdrop"
  >
    <div :class="['relative w-full rounded-2xl bg-white p-6 shadow-xl', maxWidthClass]">
      <button
        v-if="showClose"
        @click="close"
        class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        &times;
      </button>

      <div v-if="$slots.header || title" class="mb-4">
        <slot name="header">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
        </slot>
      </div>

      <div>
        <slot />
      </div>

      <div v-if="$slots.footer" class="mt-5">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  maxWidth: { type: String, default: 'md' }, // sm | md | lg | xl
  closeOnBackdrop: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm':
      return 'max-w-sm'
    case 'lg':
      return 'max-w-lg'
    case 'xl':
      return 'max-w-xl'
    default:
      return 'max-w-md'
  }
})

function close() {
  emit('close')
}

function onBackdrop() {
  if (props.closeOnBackdrop) emit('close')
}
</script>

<style scoped>
</style>

