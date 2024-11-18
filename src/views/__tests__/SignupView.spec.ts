import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SignupView from '../SignupView.vue'

// Mocking the useMutation function from @tanstack/vue-query
vi.mock('@tanstack/vue-query', () => {
  return {
    useMutation: () => ({
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
    }),
  }
})

describe('SignupView', () => {
  let wrapper: any
  const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [],
  })

  beforeEach(() => {
    wrapper = mount(SignupView, {
      global: {
        plugins: [mockRouter],
      },
    })
  })

  it('renders the signup form', () => {
    expect(wrapper.find('h2').text()).toBe('Sign Up')
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#phone').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
  })
})
