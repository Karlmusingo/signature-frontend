<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Email Signature Generator</h1>

      <!-- Editable Form -->
      <form @submit.prevent="updateSignature" class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            v-model="formData.firstName"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label class="block text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            v-model="formData.lastName"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label class="block text-gray-600 mb-1">Phone Number</label>
          <input
            type="tel"
            v-model="formData.phoneNumber"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label class="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            v-model="formData.email"
            disabled
            class="w-full px-4 py-2 border rounded bg-gray-50 cursor-not-allowed"
          />
        </div>
        <div class="col-span-2">
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update profile
          </button>
        </div>
      </form>

      <!-- Signature Preview -->
      <div class="mt-8 p-4 bg-gray-50 border rounded">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Signature Preview</h2>
        <div ref="signatureContent" class="text-gray-700">
          <p>
            <strong>{{ formData.firstName }} {{ formData.lastName }}</strong>
          </p>
          <p>{{ formData.title }}</p>
          <p>{{ formData.phoneNumber }}</p>
          <p>{{ formData.email }}</p>
          <p>{{ formData.companyName }}</p>
          <p>{{ formData.address }}</p>
          <p>{{ formData.missionStatement }}</p>
          <a :href="formData.websiteUrl" class="text-blue-500 hover:underline">{{
            formData.websiteUrl
          }}</a>
        </div>
      </div>

      <!-- Instructions and Outlook Update Button -->
      <div class="mt-4">
        <div class="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <p>
            Clicking this button will copy your signature and open Outlook settings in a new tab.
          </p>
          <p>Once there, create a new signature and paste (Ctrl+V) the copied content.</p>
        </div>

        <button
          @click="updateOutlookSignature"
          class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Update signature on Outlook
        </button>

        <p v-if="showCopySuccess" class="text-green-600 text-sm mt-2 text-center">
          Signature copied! Redirecting to Outlook...
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useMutation } from '@tanstack/vue-query'
import { useToast } from 'vue-toast-notification'
import http from '../utils/http'

export default {
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        title: '',
        companyName: '',
        missionStatement: '',
        websiteUrl: '',
        address: '',
      },
      showCopySuccess: false,
    }
  },
  setup() {
    const $toast = useToast()
    // Query for fetching profile
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ['profile'],
      queryFn: () => http.get('/users/profile'),
    })

    // Mutation for updating profile
    const {
      mutate,
      isPending: isUpdating,
      error: updateError,
    } = useMutation({
      mutationFn: (data) => http.put('/users/', data),
      onSuccess: () => {
        $toast.success('Profile updated successfully!')
      },
      onError: (error) => {
        $toast.error(error?.response?.data?.message || 'Failed to update profile')
        console.error('Failed to update profile:', error)
      },
    })

    return {
      profileData: data,
      isLoading,
      isError,
      error,
      updateProfile: mutate,
      isUpdating,
      updateError,
    }
  },
  methods: {
    updateSignature() {
      const updateData = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        phoneNumber: this.formData.phoneNumber,
      }
      // @ts-ignore
      this.updateProfile(updateData)
    },
    async updateOutlookSignature() {
      try {
        // Create formatted text signature
        const signature = [
          `${this.formData.firstName} ${this.formData.lastName}`,
          this.formData.title,
          this.formData.phoneNumber,
          this.formData.email,
          this.formData.companyName,
          this.formData.address,
          this.formData.missionStatement,
          this.formData.websiteUrl,
        ]
          .filter((line) => line) // Remove empty lines
          .join('\n') // Join with newlines

        // Copy to clipboard
        await navigator.clipboard.writeText(signature)

        // Show success message
        this.showCopySuccess = true

        // Open Outlook signatures page in new tab
        window.open(
          'https://outlook.office.com/mail/options/accounts-category/signatures-subcategory',
          '_blank',
        )

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showCopySuccess = false
        }, 3000)
      } catch (error) {
        console.error('Failed to copy signature:', error)
        alert('Failed to copy signature. Please try again.')
      }
    },
  },
  watch: {
    profileData: {
      handler(newData) {
        if (newData) {
          this.formData = {
            firstName: newData.data.firstName || '',
            lastName: newData.data.lastName || '',
            phoneNumber: newData.data.phoneNumber || '',
            email: newData.data.email || '',
            title: newData.data.title || '',
            companyName: newData.data.companyDetails?.companyName || '',
            missionStatement: newData.data.companyDetails?.missionStatement || '',
            websiteUrl: newData.data.companyDetails?.websiteUrl || '',
            address: newData.data.companyDetails?.address || '',
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style>
/* Additional custom styles if needed */
</style>
