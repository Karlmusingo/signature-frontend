import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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

describe('LoginView', () => {
  let wrapper: any
  const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [],
  })

  beforeEach(() => {
    wrapper = mount(LoginView, {
      global: {
        plugins: [mockRouter],
      },
    })
  })

  it('renders the login form', () => {
    expect(wrapper.find('h2').text()).toBe('Login')
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
  })
})
