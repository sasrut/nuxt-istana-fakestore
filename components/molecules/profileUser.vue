<template>
    <div class="flex w-fulll flex-row justify-center items-center gap-2">
        <AtomsUIChip backgroundColor="f89292" :textChip="props.typeUser" textColor="3b1e1e"/>
        <div class="ml-4">{{ props.user }}</div>
        <div class="text-lg rounded-full bg-[#DDD] w-12 h-12 justify-center flex items-center">
             <font-awesome-icon :icon="['fa-solid', 'fa-user']" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  user: { 
    type: String,
    default: 'Guest'
  },
  typeUser: {
    type: String,
    default: 'User' // Admin | User
  }
})
</script>