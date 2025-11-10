<template>
  <transition name="slide">
    <div class="fixed inset-0 z-50 flex">
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black bg-opacity-40 z-40 cursor-pointer"
        @click="$emit('close')"
      ></div>

      <!-- Sidebar -->
      <div
        class="relative z-50 w-[300px] h-full bg-white shadow-lg flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-semibold">Menu</h2>
          <AtomsUIButton @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <font-awesome-icon :icon="['fas', 'fa-xmark']" class="text-xl"/>
          </AtomsUIButton>
        </div>

        <!-- Menu Items -->
        <div class="flex-1 p-4 flex flex-col justify-between">
          <div
            class="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            :class="currentMenu === 'product' ? 'font-bold bg-gray-100' : ''"
            @click="select('product')"
          >
            <font-awesome-icon :icon="['fas', 'fa-box']" class="mr-2 text-gray-700">
            </font-awesome-icon>
            <span> Product</span>
          </div>

          <div
            class="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            :class="currentMenu === 'user' ? 'font-bold bg-gray-100' : ''"
            @click="select('user')"
          >
            <font-awesome-icon :icon="['fas', 'fa-users']" class="mr-2"></font-awesome-icon>
            <span> Users</span>
          </div>

          <div
            class="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            :class="currentMenu === 'cart' ? 'font-bold bg-gray-100' : ''"
            @click="select('cart')"
          >
            <font-awesome-icon :icon="['fas', 'fa-cart-shopping']" class="mr-2"></font-awesome-icon>
            <span> Cart</span>
          </div>

          <div class="border-t pt-3 mt-auto">
            <div
              @click="logoutPage"
              class="block px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
              :class="currentMenu === 'logout' ? 'font-bold bg-red-100' : ''"
            >
              <font-awesome-icon :icon="['fas', 'fa-right-from-bracket']" class="mr-2"></font-awesome-icon>
              <span> Logout</span>
            </div>
          </div>


        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
// definePageMeta({ name: 'SideBar' })
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  currentMenu: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select', 'close'])

const select = (menu) => {
  emit('select', menu)
}

const logoutPage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  // localStorage.clear()
  router.push('/')
}

</script>