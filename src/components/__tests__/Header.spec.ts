import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '../Header.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/login', component: { template: '<div>Login</div>' } },
  { path: '/signup', component: { template: '<div>Signup</div>' } },
  { path: '/users', component: { template: '<div>Users</div>' } },
  { path: '/company', component: { template: '<div>Company</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('Header.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    router.push('/')
  })

  it('renders the header and navigation links', async () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [router],
      },
    })
    await router.isReady()

    expect(wrapper.find('h1').text()).toBe('Email Signature Generator')
    expect(wrapper.findAll('li').length).toBe(2) // Home, Logout
  })

  it('shows admin links when user is admin', async () => {
    localStorage.setItem('role', 'ADMIN')
    const wrapper = mount(Header, {
      global: {
        plugins: [router],
      },
    })
    await router.isReady()

    expect(wrapper.findAll('li').length).toBe(4) // Home, Users, Company, Logout
  })

  it('hides navigation on login and signup pages', async () => {
    router.push('/login')
    const wrapper = mount(Header, {
      global: {
        plugins: [router],
      },
    })
    await router.isReady()

    expect(wrapper.find('header').exists()).toBe(true)

    router.push('/signup')
    await router.isReady()
    expect(wrapper.find('header').exists()).toBe(true)
  })

  it('logs out the user', async () => {
    localStorage.setItem('token', 'some-token')
    localStorage.setItem('role', 'ADMIN')
    const wrapper = mount(Header, {
      global: {
        plugins: [router],
      },
    })
    await router.isReady()

    await wrapper.find('#logout').trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
  })
})
