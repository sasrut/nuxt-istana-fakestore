<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-between items-start">
        <div class="grid lg:col-span-2 min-w-full justify-center align-center items-center gap-2">
            <AtomsUICard
              v-for="cart in cartItems"
              :key="cart.id"
              :layout="isMobile? 'vertical': 'horizontal'"
              class="mb-4">
              <div class="grid lg:grid-cols-3 p-6 relative">
                  <div class="grid grid-cols-1">
                      <img
                          v-if="cart.image"
                          :src="cart.image"
                          alt="img"
                          class="max-h-full w-auto max-w-[120px] rounded object-contain"
                          />
                  </div>
                  <div class="grid grid-cols-1 col-span-2 gap-2">
                      <div class="font-bold font-sans text-xl">{{ cart.title }}</div>
                      <div class="text-gray-500">{{ cart.description }}</div>
                      <div class="flex flex-col justify-between w-full">
                          <div class="flex flex-row justify-between items-center mt-auto">
                              <div class="text-gray-700 font-medium">Price: $ {{ cart.price }}</div>
                              <div class="text-gray-700 font-medium">Quantity: x {{ cart.quantity }}</div>
                              <div class="text-gray-900 font-bold text-xl">Total: $ {{ cart.price * cart.quantity }}</div>
                          </div>
                      </div>
                  </div>
                  <AtomsUIButton variant="ghost" class="absolute top-2 right-2" @click="askDelete(cart)">
                      <!-- <div class="fa fa-trash h-[20px] text-lg items-center text-red-600 cursor-pointer"></div> -->
                       <font-awesome-icon :icon="['fas', 'fa-trash']" class="h-[20px] text-lg items-center text-red-600 cursor-pointer"/>
                  </AtomsUIButton>
              </div>
            </AtomsUICard>
        </div>
        <!-- confirm -->
        <div class="w-full bg-white gap-4 flex flex-col p-4 rounded-lg shadow-md">
            <p class="flex text-3xl font-sans font-bold">Keranjang</p>
            <div class="flex flex-col w-full"
              v-for="c in cartItems"
              :key="c.id">
                <div class="flex flex-row justify-between">
                    <div class="mr-2">{{ c.id }}.</div>
                    <div>{{ truncateText(c.title, 25) }}</div>
                    <div class="ml-auto text-gray-500">$ {{ c.price }}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="text-sm text-gray-400">x {{ c.quantity }}</div>
                    <div class="ml-auto">$ {{ c.quantity*c.price }}</div>
                </div>
            </div>
            <div class="flex flex-row justify-between font-bold border-t pt-2 mt-2">
                <h2>Subtotal</h2>
                <div class="ml-auto">$ {{ calculateTotalPrice() }}</div>
            </div>
            <div class="flex flex-col gap-2">
                <p class="flex text-2xl font-sans font-bold mt-4">Shipping</p>
                <p class="font-sm text-gray-400">Jl. Merderka 123, Tangerang</p>
                <div class="flex flex-row justify-between">
                    <div>Shipping Cost</div>
                    <div class="ml-auto">$ {{ shippingCost }}</div>
                </div>
            </div>
            <p class="flex text-2xl font-sans font-bold mt-4">Payment Methods</p>
            <div class="flex gap-6 flex-col">
                <div class="px-3 py-2 w-full border-2 rounded font-medium">BCA</div>
                <div class="cursor-pointer underline text-md text-blue-600">Add Promotional code</div>
                <div class="font-bold text-3xl justify-between flex">
                    <p>Total</p>
                    <div class="ml-auto">$ {{ calculateTotalPrice() + shippingCost }}</div>
                </div>

                <AtomsUIButton class="w-full bg-blue-600 text-white py-3 rounded !text-2xl font-bold hover:bg-blue-700">
                    Proceed to Payment
                </AtomsUIButton>
            </div>
            
        </div>
    </div>
    <!-- error & loading handlers -->
    <div v-if="loading" class="text-sm text-gray-500 mt-3">Loading carts...</div>
    <div v-else-if="!cartItems || cartItems.length===0" class="text-sm text-gray-500 mt-3">No cart items to display.</div>
    <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { deleteCartById, fetchCartById } from '../server/cartStore'
import { fetchProductsApi } from '../server/productStore'

const error = ref('')
const carts = ref([])
const products = ref([])
const cartItems = ref([])
const shippingCost = ref(5.00)
const loading = ref(false)

const isMobile = computed(() => window.innerWidth < 768)

function mergeCartWithProducts() {
  if (!carts.value.products) return
  cartItems.value = carts.value.products.map(item => {
    const product = products.value.find(p => p.id === item.productId)
    return {
      ...item,
      ...product,
    }
  })
  loading.value = false
  console.log('Merged Cart Items:', cartItems.value)
}

function calculateTotalPrice() {
  if (!cartItems.value || cartItems.value.length === 0) return 0
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

async function askDelete(cart) {
  console.log('Ask delete cart item:', carts.value)
  if(!cart) return
  try {
    cartItems.value = cartItems.value.filter((c) => c.id !== cart.id)
    await deleteCartById(cart.id)
    console.log("abis delete:", cartItems.value)
  } catch (err) {
    error.value = 'Failed to delete product: ' + err.message
  } 
}

onMounted(async () => {
  if (!cartItems.value || cartItems.value.length === 0) {
    loading.value = true
    error.value = ''
    try {
      products.value = await fetchProductsApi()
      carts.value = await fetchCartById(1)
      mergeCartWithProducts()
    } catch (err) {
      error.value = 'Failed to load products: ' + err.message
    }
    loading.value = false
  }
})

</script>
