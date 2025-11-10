<template>
  <div class="p-4 bg-white rounded-2xl shadow-sm">
    <form class="space-y-3">

      <!-- form product -->
      <template v-if="newType === 'product'">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input v-model="form.title" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <input v-model.number="form.price" type="number" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea v-model="form.description" required class="w-full p-2 rounded border"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <input v-model="form.category" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Image URL</label>
          <input v-model="form.image" class="w-full p-2 rounded border" />
        </div>
      </template>

        <!-- form user -->
      <template v-else-if="newType === 'user'">
        <div>
          <label class="block text-sm font-medium mb-1">First Name</label>
          <input v-model="form.name.firstname" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Last Name</label>
          <input v-model="form.name.lastname" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full p-2 rounded border" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="form.username" required class="w-full p-2 rounded border" />
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input v-model="form.password" required class="w-full p-2 rounded border" type="text">
            </input>
        </div>
      </template>

      <div class="flex gap-2">
        <div class="mt-2 flex justify-end gap-2">
            <AtomsUIButton variant="ghost" @click="$emit('cancel')">Batal</AtomsUIButton>
            <AtomsUIButton :disabled="saving" variant="primary" type="button" @click="handleUpdated">Simpan</AtomsUIButton>
        </div>
      </div>

      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="message" class="text-green-600 mt-2">{{ message }}</div>
    </form>
  </div>
</template>

<script setup>
import { watch, ref, reactive, nextTick } from 'vue'
import { updateUsersApi } from '../server/userStore';
import { updateProductApi } from '../server/productStore';

const emit = defineEmits(['items-updated', 'cancel'])
const props = defineProps({
  product: Object,
  user: Object,
  newType: String
})

const saving = ref(false)
const error = ref('')
const message = ref('')

const form = reactive(
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

watch(
  () => [props.product, props.user, props.newType],
  ([p, u, type]) => {
    if (type === 'product' && p) {
      console.log(props.product, p)
      if (!p) return
      form.title = p?.title || ''
      form.price = p?.price || 0
      form.description = p?.description || ''
      form.category = p?.category || ''
      form.image = p?.image || ''
    }

    if (type === 'user' && u) {
        // console.log(props.user, u)
      if (!u) return
        form.name.firstname = u?.name?.firstname || ''
        form.name.lastname = u?.name?.lastname || ''
        form.email = u?.email || ''
        form.username = u?.username || ''
        form.password = u?.password || ''
    }
},
  { immediate: true }
)

async function handleUpdated() {
    saving.value = true
    error.value = ''
    message.value = ''

    try {
        let updated
        // update product
        if (props.newType === 'product' && props.product) {
        const updatedData = {
            ...props.product,
            title: form.title,
            price: form.price,
            description: form.description,
            category: form.category,
            image: form.image
        }
            updated = await updateProductApi(props.product.id, updatedData)
            emit('items-updated', updated)
        } 
        // update user
        else if (props.newType === 'user' && props.user) {
        const updatedData = {
            ...props.user,
            name: { ...form.name },
            email: form.email,
            username: form.username,
            password: form.password
        }
            updated = await updateUsersApi(props.user.id, updatedData)
            emit('items-updated', updated)
        }

        await nextTick()
        message.value = 'Data updated successfully!'
    } catch (err) {
        error.value = 'Failed to update: ' + err.message
    } finally {
        saving.value = false
    }

}
</script>