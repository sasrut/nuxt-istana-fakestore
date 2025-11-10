<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <!-- Username -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Username</label
        >
        <input
          type="username"
          v-model="username"
          placeholder="Enter your username"
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <!-- Password -->
      <div class="mb-4 relative">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <div class="flex flex-row relative items-center">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter your password"
              class="w-full border relative rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-300"
            >
            
                <!-- Toggle Show/Hide -->
                <div
                @click="togglePassword"
                class="flex absolute right-4 text-gray-500 cursor-pointer"
                >
                    <font-awesome-icon :icon="showPassword ? ['fas', 'fa-eye-slash'] : ['fas', 'fa-eye']"/>
                </div>
            </input>
        </div>
      </div>

      <!-- Login UIButton -->
      <AtomsUIButton
        @click="handleLogin"
        variant="primary"
      >
        Login
      </AtomsUIButton>
    </div>
  </div>
</template>

<script setup>
// import fontawesome from '~/plugins/fontawesome'

definePageMeta({ name: 'login', })
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  // router.push('/dashboard')
  // try {
  //   const credentials = {
  //     username: 'jhond',
  //     password: 'm38rmF$',
  //   }
  //   const res = await fetch('https://fakestoreapi.com/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     // body: JSON.stringify(credentials),
  //     body: JSON.stringify(credentials),
  //   })
  //   const data = await res.json()

  //   if (res.ok && data.token) {
  //     localStorage.setItem('token', data.token)
      localStorage.setItem('username', username.value)
  //     // sync ke useState agar middleware tahu
  //     useState('username').value = username.value

      router.push('/dashboard')
  //   }else {
  //     error.value = 'Username atau password salah'
  //   }
  // } catch (err) {
  //   error.value = 'Terjadi kesalahan koneksi'
  // }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>