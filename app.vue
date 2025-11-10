<script setup>
onMounted(() => {
  const stored = localStorage.getItem('token')
  useState('token').value = stored === null ? '' : stored
})
</script>

<template>
  <NuxtPage />
</template>
