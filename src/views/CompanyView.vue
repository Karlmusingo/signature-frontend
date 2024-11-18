<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Update Company Details</h1>

      <!-- Company Details Form -->
      <form @submit.prevent="updateCompanyDetails" class="space-y-4">
        <!-- Company Name -->
        <div>
          <label class="block text-gray-600 mb-1">Company Name</label>
          <input
            type="text"
            v-model="formData.companyName"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter company name"
          />
        </div>

        <!-- Mission Statement -->
        <div>
          <label class="block text-gray-600 mb-1">Mission Statement</label>
          <textarea
            v-model="formData.missionStatement"
            rows="3"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter mission statement"
          ></textarea>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-gray-600 mb-1">Address</label>
          <input
            type="text"
            v-model="formData.address"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter address"
          />
        </div>

        <!-- Website URL -->
        <div>
          <label class="block text-gray-600 mb-1">Website URL</label>
          <input
            type="url"
            v-model="formData.websiteUrl"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter website URL"
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isUpdating"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            <span v-if="isUpdating" class="loader">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useQuery, useMutation } from '@tanstack/vue-query'
import { useToast } from 'vue-toast-notification'
import http from '../utils/http'

export default {
  data() {
    return {
      formData: {
        companyName: '',
        missionStatement: '',
        address: '',
        websiteUrl: '',
      },
    }
  },
  setup() {
    const $toast = useToast()

    const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: ['companyDetails'],
      queryFn: () => http.get('/company/'),
    })

    const {
      mutate,
      isPending: isUpdating,
      error: updateError,
    } = useMutation({
      mutationFn: (data) => http.put('/company/', data),
      onSuccess: () => {
        $toast.success('Company details updated successfully!')
        refetch()
      },
      onError: (error) => {
        $toast.error(error?.response?.data?.message || 'Failed to update company details')
        console.error('Failed to update company details:', error)
      },
    })

    return {
      companyData: data,
      isLoading,
      isError,
      error,
      updateCompany: mutate,
      isUpdating,
      updateError,
    }
  },
  created() {
    // No need to fetch manually, data will be handled in the watch
  },
  watch: {
    companyData: {
      handler(newData) {
        if (newData) {
          this.formData = {
            companyName: newData.data.companyName || '',
            missionStatement: newData.data.missionStatement || '',
            address: newData.data.address || '',
            websiteUrl: newData.data.websiteUrl || '',
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    updateCompanyDetails() {
      const updateData = {
        companyName: this.formData.companyName,
        missionStatement: this.formData.missionStatement,
        address: this.formData.address,
        websiteUrl: this.formData.websiteUrl,
      }

      this.updateCompany(updateData)
    },
  },
}
</script>

<style>
/* Additional custom styles if needed */
</style>
