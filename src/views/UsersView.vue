<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-gray-600 text-center">Loading users...</div>
      <div v-if="isError" class="text-red-600 text-center">
        Error loading users: {{ error.message }}
      </div>

      <!-- Users List -->
      <div v-if="users?.length" class="space-y-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between p-4 bg-gray-50 border rounded"
        >
          <div>
            <p class="font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-gray-600">{{ user.title }}</p>
          </div>

          <button @click="editTitle(user)" class="text-green-500 hover:underline ml-4">
            Edit Title
          </button>
        </div>
      </div>

      <!-- Modal for editing title -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white rounded p-8 w-1/2">
          <h2 class="text-lg font-bold mb-4">Edit Title</h2>
          <input
            v-model="newTitle"
            type="text"
            class="border p-2 w-full"
            placeholder="Enter new title"
          />
          <div class="mt-4 flex justify-end">
            <div>
              <button
                @click="saveTitle"
                :disabled="updating"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span v-if="updating" class="loader">Saving...</span>
                <span v-else>Save</span>
              </button>
            </div>

            <button
              :disabled="updating"
              @click="isModalOpen = false"
              class="text-red-500 hover:underline ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuery, useMutation } from '@tanstack/vue-query'
import http from '../utils/http' // Ensure this is the correct path to your http utility

export default {
  data() {
    return {
      isModalOpen: false,
      newTitle: '',
      currentUser: null,
    }
  },
  setup() {
    const {
      data: usersData,
      isLoading,
      isError,
      error,
      refetch,
    } = useQuery({
      queryKey: ['users'],
      queryFn: () => http.get('/users/').then((response) => response.data),
    })

    const mutation = useMutation({
      mutationFn: (data) => http.put(`/users/title/${data.userId}`, { title: data.title }),
      onSuccess: () => {
        $toast.success('User title updated successfully!')
        refetch()
      },
      onError: (error) => {
        $toast.error(error?.response?.data?.message || 'Failed to update user title')
        console.error('Error updating title:', error)
      },
    })

    return {
      users: usersData,
      isLoading,
      isError,
      error,
      mutation,
      updating: mutation.isPending,
    }
  },
  methods: {
    editTitle(user) {
      this.currentUser = user
      this.newTitle = user.title
      this.isModalOpen = true
    },
    saveTitle() {
      if (this.currentUser) {
        console.log('Saving title:', this.currentUser.id, this.newTitle)
        this.mutation.mutate(
          { userId: this.currentUser.id, title: this.newTitle },
          {
            onSuccess: (data, variables, context) => {
              this.isModalOpen = false
            },
          },
        )
      }
    },
  },
}
</script>

<style>
/* Additional custom styles if needed */
</style>
