<template>
    <div class="p-2">
        <h2 class="text-2xl font-bold mb-4">User Table</h2>

        <!-- Header -->
        <div :class="isMobile? 'overflow-x-scroll' : 'overflow-x-hidden'">         
          <div
              v-if="isMobile"
              class="grid lg:[grid-template-columns:48px_1fr_1fr_1fr_1fr_1fr] gap-1 bg-gray-200 font-semibold text-gray-700 p-2 rounded-md"
          >
              <div>ID</div>
              <div>Nama</div>
              <div>Username</div>
              <div>Email</div>
              <div>Password</div>
              <div>Actions</div>
          </div>
  
          <!-- Rows -->
          <div
              v-for="user in users"
              :key="user.id"
              class="bg-white shadow-sm grid lg:[grid-template-columns:48px_1fr_1fr_1fr_1fr_1fr] gap-3 lg:gap-1 items-center border-b p-2 text-gray-800 hover:bg-gray-50 cursor-pointer"
          >
              <div>{{ user.id }}</div>
              <div>{{ user.name.firstname + ' ' + user.name.lastname }}</div>
              <div>{{ user.username }}</div>
              <div>{{ user.email }}</div>
              <div>{{ user.password }}</div>
              <div class="flex gap-2">
                  <AtomsUIButton @click="openEdit(user)"
                  class="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <font-awesome-icon :icon="['fas', 'fa-pen-to-square']" />
                  </AtomsUIButton>
                  <AtomsUIButton @click="askDelete(user)"
                  class="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <font-awesome-icon :icon="['fas', 'fa-trash-can']" />
                  </AtomsUIButton>
              </div>
          </div>
        </div>
    </div>

    <!-- error & loading handlers -->
    <div v-if="loading" class="text-sm text-gray-500 mt-3">Loading users...</div>
    <div v-else-if="!users || users.length===0" class="text-sm text-gray-500 mt-3">No users to display.</div>
    <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>

    <!-- add new user button -->
    <div class="relative w-full h-full">
       <div class="fixed bottom-10 right-8 z-50">
         <AtomsUIButton variant="ghost" @click="showAddForm = true">
           <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#232323] text-white text-2xl shadow-lg hover:bg-blue-700 focus:outline-none">
            <font-awesome-icon :icon="['fas', 'fa-plus']" />
           </div>
         </AtomsUIButton>
       </div>
    </div>

    <!-- add user form modal -->
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
            @click="showAddForm = false"
          >
            Close
          </AtomsUIButton>
          <AddNewForm new-type="user" @items-created="handlerNewUser" />
        </div>
      </div>
    </transition>

    <!-- alert delete user per id -->
  <MoleculesModalView :open="confirmDeleteOpen" @close="cancelDelete" title="Hapus user?" maxWidth="sm">
    <p class="text-sm text-gray-600">Anda yakin ingin menghapus username
      <span class="font-medium">"{{ userToDelete?.username }}"</span>?
    </p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <AtomsUIButton variant="primary" @click="cancelDelete">Batal</AtomsUIButton>
        <AtomsUIButton variant="danger" @click="confirmDelete">Hapus</AtomsUIButton>
      </div>
    </template>
  </MoleculesModalView>

  <!-- edit user -->
  <MoleculesModalView :open="isEditOpen" @close="closeEdit" :title="'Edit: ' + (userToEdit?.username || '')" maxWidth="md">
    <EditItemForm v-if="userToEdit" :user="userToEdit" new-type="user" @cancel="closeEdit" @items-updated="onUserUpdated" />
  </MoleculesModalView>


</template>

<script setup>
definePageMeta({ name: 'userDashboard' })
import { ref, onMounted } from 'vue'
import { fetchUsersApi, deleteUsersApi } from '../server/userStore'

const loading = ref(false)
const showAddForm = ref(false)
const confirmDeleteOpen = ref(false)
const userToDelete = ref(null)
const isEditOpen = ref(false)
const userToEdit = ref(null)
const error = ref('')
const users = ref([])

const isMobile = computed(() => window.innerWidth < 768)

function handlerNewUser(newUser) {
  console.log('new user received:', newUser)
  if(newUser) users.value = [newUser, ...users.value]
  showAddForm.value = false
}

function askDelete(user) {
  userToDelete.value = user
  console.log('ask delete user:', userToDelete.value)
  confirmDeleteOpen.value = true
}

async function confirmDelete() {
  if (!userToDelete.value) return
  error.value = ''
  try {
    await deleteUsersApi(userToDelete.value.id)
    // hapus produk dari list temp user
    users.value = users.value.filter((p) => p.id !== userToDelete.value.id)
    confirmDeleteOpen.value = false
    userToDelete.value = null
  } catch (err) {
    error.value = 'Failed to delete user: ' + err.message
  } 
}

function cancelDelete() {
  confirmDeleteOpen.value = false
  userToDelete.value = null
}

function openEdit(user) {
  userToEdit.value = user
  isEditOpen.value = true
}

function closeEdit() {
  isEditOpen.value = false
  userToEdit.value = null
}

function onUserUpdated(updated) {
  const index = users.value.findIndex(u => u.id === updated.id)
  if (index !== -1) {
    users.value[index] = updated
  }
  console.log('updated user:', updated, users.value)
  closeEdit()
}

onMounted(async () => {
  if (!users.value || users.value.length === 0) {
    loading.value = true
    error.value = ''
    try {
      const data = await fetchUsersApi()
      users.value = data
    } catch (err) {
      error.value = 'Failed to load users: ' + err.message
    } finally {
      loading.value = false
    }
  }
})
</script>