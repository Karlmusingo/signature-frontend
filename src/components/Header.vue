### 1. Create `Header.vue` ```vue
<!-- src/components/Header.vue -->
<template>
  <header v-if="!hideNavigation" class="bg-blue-500 text-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Email Signature Generator</h1>
      <nav>
        <ul class="flex space-x-6">
          <li>
            <RouterLink
              to="/"
              class="hover:text-gray-200 transition"
              active-class="font-bold border-b-2 border-white"
            >
              Home
            </RouterLink>
          </li>
          <li v-if="isAdmin">
            <RouterLink
              to="/users"
              class="hover:text-gray-200 transition"
              active-class="font-bold border-b-2 border-white"
            >
              Users
            </RouterLink>
          </li>
          <li v-if="isAdmin">
            <RouterLink
              to="/company"
              class="hover:text-gray-200 transition"
              active-class="font-bold border-b-2 border-white"
            >
              Company
            </RouterLink>
          </li>
          <li>
            <button id="logout" @click="logout" class="hover:text-gray-200 transition">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const hideNavigation = computed(() => {
  return ['/login', '/signup'].includes(route.path)
})

const isAdmin = computed(() => {
  const role = localStorage.getItem('role')
  return role === 'ADMIN'
})

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
  }
})

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
}
</script>

<style scoped></style>
```
