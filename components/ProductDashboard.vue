<template>
  <!-- dashboard card -->
  <div class="flex min-w-full justify-center align-center items-center flex-wrap flex-row gap-4">
    <AtomsUICard
      v-for="p in products"
      :key="p.id"
      layout="vertical"
    >
      <!-- Konten AtomsUICard dimasukkan ke slot -->
      <div class="flex flex-row gap-1 font-sans justify-between relative">
        <div class="flex flex-col relative">
          <div class="font-serif text-sm text-[#919191]">{{ p.category }}</div>
          <div class="text-lg font-bold w-full max-w-[200px]">{{ p.title }}</div>
        </div>
        <AtomsUIButton variant="ghost" class="absolute top-0 right-0" @click="askDelete(p)">
            <font-awesome-icon  :icon="['fas', 'fa-trash']" class="h-[20px] text-lg items-center text-red-600 cursor-pointer" />
        </AtomsUIButton>
      </div>

      <div class="flex items-center justify-center h-full">
        <img
          v-if="p.image"
          :src="p.image"
          alt="img"
          class="max-h-full w-auto max-w-[120px] rounded object-contain"
        />
        <span v-else class="text-xs text-gray-400">—</span>
      </div>
      <div class="mt-auto gap-2 flex flex-col">
        <div class="flex flex-col justify-between items-start gap-4">
          <div class="flex justify-between flex-row w-full items-center">
            <div class="text-3xl font-bold text-[#6a2c2c]">$ {{ p.price }}</div>
            <!-- <div class="fa-solid fa-star text-orange-400 gap-2 flex ml-auto">{{ p.rating.rate }}<span class="fa-solid fa-shopping">({{ p.rating.count }})</span></div> -->
          </div>
          <div class="flex flex-row gap-1">
            <AtomsUIButton @click="addToCart(p)">
              <font-awesome-icon :icon="['fas', 'fa-cart-shopping']" class="h-[20px] items-center cursor-pointer"/>
            </AtomsUIButton>
            <AtomsUIButton @click="openEdit(p)">
              <font-awesome-icon :icon="['fas', 'fa-pen-to-square']" class="h-[20px] items-center text-blue-600 cursor-pointer"/>
            </AtomsUIButton>
            <AtomsUIButton @click="openProductModal(p)">Details</AtomsUIButton>
          </div>
        </div>
      </div>
    </AtomsUICard>
  </div>

  <!-- add new catalog button -->
  <div class="relative w-full h-full">
    <div class="fixed bottom-10 right-8 z-50">
      <AtomsUIButton variant="ghost" @click="showAddForm = true">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700 focus:outline-none">
           <font-awesome-icon :icon="['fas', 'fa-plus']" />
        </div>
      </AtomsUIButton>
    </div>
  </div>
  <!-- add product form modal -->
  <transition name="fade">
    <div
      v-if="showAddForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="showAddForm = false"
    >
      <div class="relative w-full max-w-lg">
        <AtomsUIButton
          class="absolute right-3 top-3"
          variant="ghost"
          @click="showAddForm= false"
        >
          Close
        </AtomsUIButton>
        <AddNewForm new-type="product" @items-created="onProductCreated" />
      </div>
    </div>
  </transition>

  <!-- edit product per id -->
  <MoleculesModalView :open="editOpen" @close="closeEdit" :title="'Edit: ' + (productToEdit?.title || '')" maxWidth="lg">
     <EditItemForm v-if="productToEdit" :product="productToEdit" new-type="product" @cancel="closeEdit" @items-updated="onProductUpdated" />
  </MoleculesModalView>


  <!-- read details per id -->
  <MoleculesModalView :open="isDetailsOpen" @close="closeModal" :title="selectedProduct?.title" maxWidth="md">
    <div class="flex items-start gap-4">
      <img v-if="selectedProduct?.image" :src="selectedProduct.image" alt="product" class="h-24 w-24 rounded object-cover" />
      <div class="flex-1 space-y-1">
        <p class="text-sm text-gray-500">Category: {{ selectedProduct?.category }}</p>
        <p class="font-medium text-green-600">${{ selectedProduct?.price }}</p>
      </div>
    </div>
    <p class="mt-4 text-sm text-gray-600 whitespace-pre-line">{{ selectedProduct?.description }}</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <AtomsUIButton>
          <font-awesome-icon :icon="['fas', 'fa-cart-shopping']" class="h-[20px] items-center"/>
        </AtomsUIButton>
        <AtomsUIButton @click="closeModal">Close</AtomsUIButton>
      </div>
    </template>
  </MoleculesModalView>

  <!-- alert delete product per id -->
  <MoleculesModalView :open="confirmDeleteOpen" @close="cancelDelete" title="Hapus produk?" maxWidth="sm">
    <p class="text-sm text-gray-600">Anda yakin ingin menghapus produk
      <span class="font-medium">"{{ productToDelete?.title }}"</span>?
    </p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <AtomsUIButton variant="primary" @click="cancelDelete">Batal</AtomsUIButton>
        <AtomsUIButton variant="danger" @click="confirmDelete">Hapus</AtomsUIButton>
      </div>
    </template>
  </MoleculesModalView>



  <!-- error & loading handlers -->
  <div v-if="loading" class="text-sm text-gray-500 mt-3">Loading products...</div>
  <div v-else-if="!products || products.length===0" class="text-sm text-gray-500 mt-3">No products to display.</div>
  <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'
import { deleteProductApi, fetchProductById, fetchProductsApi } from '../server/productStore'
import { createCartApi } from '../server/cartStore'
import { icon } from '@fortawesome/fontawesome-svg-core'

const selectedProduct = ref(null)
const error = ref('')
const loading = ref(false)
const products = ref([])
const confirmDeleteOpen = ref(false)
const productToDelete = ref(null)
const editOpen = ref(false)
const productToEdit = ref(null)
const showAddForm = ref(false)


const isDetailsOpen = computed(() => !!selectedProduct.value)

async function openProductModal(product) {
  error.value = ''
  // selectedProduct.value = product
  try {
    const data = await fetchProductById(product.id)
    selectedProduct.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load product details: ' + err.message
  }
}

function openEdit(product) {
  productToEdit.value = product
  editOpen.value = true
}

function closeEdit() {
  editOpen.value = false
  productToEdit.value = null
}

function onProductUpdated(updated) {
  products.value = products.value.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
  // console.log('updated product:', updated, products.value)
  closeEdit()
}

function onProductCreated(newProduct) {
  // add new product to temp products
  products.value = [newProduct, ...products.value]
  showAddForm.value = false
}

function askDelete(product) {
  productToDelete.value = product
  confirmDeleteOpen.value = true
}

async function confirmDelete() {
  if (!productToDelete.value) return
  error.value = ''
  // console.log('confirm delete product:', productToDelete.value) 
  try {
    await deleteProductApi(productToDelete.value.id)
    // hapus produk dari list temp products
    products.value = products.value.filter((p) => p.id !== productToDelete.value.id)
    console.log("abis delete:", products.value)
    confirmDeleteOpen.value = false
    productToDelete.value = null
  } catch (err) {
    error.value = 'Failed to delete product: ' + err.message
  } 
}

function cancelDelete() {
  confirmDeleteOpen.value = false
  productToDelete.value = null
}

function closeModal() {
  selectedProduct.value = null
}

async function addToCart(product) {
  // console.log('Add to cart:', product)
  const data = await createCartApi(product)
  console.log('Added to cart:', data)
}

onMounted(async () => {
  if (!products.value || products.value.length === 0) {
    loading.value = true
    error.value = ''
    try {
      const data = await fetchProductsApi()
      products.value = data
    } catch (err) {
      error.value = 'Failed to load products: ' + err.message
    } finally {
      loading.value = false
    }
  }
})
</script>


<style scoped>
</style>


