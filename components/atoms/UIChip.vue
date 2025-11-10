<template>
  <div class="py-2 px-4 text-md rounded-md font-bold" 
    :style="{
      backgroundColor: `#${props.backgroundColor}`,
      color: `#${props.textColor}`
    }"
  >{{ props.textChip }}</div>
</template>

<script setup>
const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'F89292'
  },
  textColor: {
    type: String,
    default: '514a4a'
  },
  textChip: String,
  
})
</script>