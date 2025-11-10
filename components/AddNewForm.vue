<template>
  <div class="p-4 bg-white rounded-2xl shadow-sm">
    <h2 class="text-lg font-semibold mb-3">
      Add New {{ newType === 'product' ? 'Product' : 'User' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-3">

      <!-- form product -->
      <template v-if="newType === 'product'">
        <div>
          <label class="block text-sm font-medium mb-1">Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Price <span class="text-red-500">*</span></label>
          <input v-model.number="form.price" type="number" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description <span class="text-red-500">*</span></label>
          <textarea v-model="form.description" required class="w-full p-2 rounded border"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Category <span class="text-red-500">*</span></label>
          <input v-model="form.category" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Image URL <span class="text-red-500">*</span></label>
          <input v-model="form.image" required class="w-full p-2 rounded border" />
        </div>
      </template>

        <!-- form user -->
      <template v-else-if="newType === 'user'">
        <div>
          <label class="block text-sm font-medium mb-1">First Name <span class="text-red-500">*</span></label>
          <input v-model="form.name.firstname" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Last Name <span class="text-red-500">*</span></label>
          <input v-model="form.name.lastname" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email <span class="text-red-500">*</span></label>
          <input v-model="form.email" type="email" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Username <span class="text-red-500">*</span></label>
          <input v-model="form.username" required class="w-full p-2 rounded border" />
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Password <span class="text-red-500">*</span></label>
            <input v-model="form.password" required class="w-full p-2 rounded border" :type="showPassword ? 'text' : 'password'">
                <!-- Toggle Show/Hide -->
                <div
                @click="showPassword = !showPassword"
                class="flex absolute right-4 text-gray-500 cursor-pointer"
                >
                    <font-awesome-icon :icon="showPassword ? ['fas', 'fa-eye-slash'] : ['fas', 'fa-eye']"/>
                </div>
            </input>
        </div>
      </template>

      <div class="flex gap-2">
        <AtomsUIButton type="submit" :disabled="posting" variant="primary">
          {{ newType === 'product' ? 'Post Product' : 'Add User' }}
        </AtomsUIButton>
      </div>

      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="message" class="text-green-600 mt-2">{{ message }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createProductApi } from '../server/productStore'
import { createUsersApi } from '../server/userStore' 

const props = defineProps({
  newType: {
    type: String,
    default: 'product', // user | product | cart
  },
})

const emit = defineEmits(['items-created'])

const posting = ref(false)
const error = ref('')
const message = ref('')
const showPassword = ref(false)
const form = ref(
  props.newType === 'product'
    ? {
        title: '',
        price: 0,
        description: '',
        category: '',
        image: ''
      }
    : {
        name: {
          firstname: '',
          lastname: ''
        },
        email: '',
        username: '',
        password: ''
      }
)

function handleSubmit() {
  posting.value = true
  error.value = ''
  message.value = ''
  console.log('submitting form for', form.value)
   if (props.newType === 'product') {
      onCreateProduct(form.value)
    } else if (props.newType === 'user') {
      onCreateUser(form.value)
    }
  posting.value = false
}

async function onCreateUser(newUser) {
    try {
        const res = await createUsersApi(newUser)
        const tempNewUser = { id: res.id, ...form.value } 
        // console.log('created user data:', newUser)
        if (newUser) emit('items-created', tempNewUser )
        message.value = 'User created!'
        form.value = {
            name: {
            firstname: '',
            lastname: ''
            },
            email: '',
            username: '',
            password: ''
        }
    }catch (err) {
        error.value = 'Failed to create user: ' + err.message
    }
}

async function onCreateProduct (newProduct) {
    try {
        const data = await createProductApi(newProduct)
        if (data) emit('items-created', data)
        message.value = 'Product created!'
        form.value = {
            title: '',
            price: 0,
            description: '',
            category: '',
            image: ''
        }
    }catch (err) {
        error.value = 'Failed to create products: ' + err.message
    }
}
</script>
