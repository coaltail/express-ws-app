import { writable } from 'svelte/store'
import { browser } from '$app/environment'

let persistedUser = browser && localStorage.getItem('user')
export let user = writable(persistedUser ? persistedUser : '')

if (browser) {
    user.subscribe(u => localStorage.user = u)
}