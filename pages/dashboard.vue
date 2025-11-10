<template>
  <div class="w-full h-full bg-gray-50 p-6 relative">
    <!-- side bar menu -->
    <SideBar
      v-show="showSidebar"
      :currentMenu="activeMenu"
      @select="setActive"
      @close="showSidebar = !showSidebar"
    ></SideBar>

    <!-- burger menu / nav -->
    <div class="w-full justify-between items-center flex flex-row py-4">
      <AtomsUIButton variant="ghost" @click="showSidebar = !showSidebar">
        <div class="flex items-center justify-center w-12 h-12 cursor-pointer text-3xl text-gray-700">
          <!-- <i class="fa-solid fa-bars"></i> -->
          <font-awesome-icon :icon="['fas', 'fa-bars']" />
        </div>
      </AtomsUIButton>
      <AtomsUIButton variant="ghost" @click="activeMenu = 'cart'">
        <div class="flex items-center relative justify-center w-12 h-12 cursor-pointer text-3xl text-gray-700">
          <!-- <i class="fa-solid fa-cart-shopping"></i> -->
          <font-awesome-icon :icon="['fas', 'fa-cart-shopping']" />
          <span class="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full"></span>
        </div>
      </AtomsUIButton>
      <MoleculesProfileUser typeUser="Admin" user="username"/>
    </div>
    
    <!-- dashboard -->
    <div class="mx-auto flex max-w-6xl flex-col gap-6">
      <ProductDashboard v-if="activeMenu == 'product'" />
      <UserDashboard v-if="activeMenu == 'user'"/>
      <CartDashboard v-if="activeMenu == 'cart'"/>
    </div>

    
  </div>
</template>

<script setup>
definePageMeta({
  name: 'dashboard'
})

const showSidebar = ref(false)
const activeMenu = ref('product')

const setActive = (menu) => {
  if (typeof menu === 'string') {
    activeMenu.value = menu
    showSidebar.value = false
  } else {
    console.warn('setActive: ', menu)
  }
}

const user = ref(null)
// const username = localStorage.getItem('username')

// onMounted(async () => {
//   try {
//     const res = await fetch('https://fakestoreapi.com/users')
//     const users = await res.json()
//     user.value = users.find(u => u.username === username)
//   } catch (err) {
//     console.error('Failed to fetch user:', err)
//   }
// })

</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>