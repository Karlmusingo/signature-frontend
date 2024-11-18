<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              type="password"
              v-model="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>
        <div v-if="isError" class="text-red-500 text-sm">
          {{ error?.response?.data?.message || 'An error occurred. Please try again.' }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isPending"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            <span v-if="isPending" class="loader">Loading...</span>
            <span v-else>Login</span>
          </button>
        </div>

        <div class="text-center mt-4">
          <router-link to="/signup" class="text-sm text-blue-600 hover:text-blue-500">
            Don't have an account? Sign up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import http from '../utils/http'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const $toast = useToast()

    onMounted(() => {
      const token = localStorage.getItem('token')
      if (token) {
        router.push('/')
      }
    })

    const { isPending, isError, error, isSuccess, mutate } = useMutation({
      mutationFn: (data) => http.post('/auth/login', data),
      onSuccess: (response) => {
        const token = response.data.token
        localStorage.setItem('token', token)

        const role = response.data.role
        localStorage.setItem('role', role)

        router.push('/')
      },
    })

    return {
      isPending,
      isError,
      error,
      isSuccess,
      mutate,
    }
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    handleLogin() {
      console.log('Login attempted with:', this.email, this.password)
      if (!this.email || !this.password) {
        alert('Email and password are required')
        return
      }
      // @ts-ignore
      this.mutate({
        email: this.email,
        password: this.password,
      })
    },
  },
}
</script>
