import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: [
        'tachyons/css/tachyons.min.css',
    ],
    head: {
        bodyAttrs: {
            class: 'bg-red'
        }
    },
    modules: [
        '@vueuse/nuxt',
        ['@nuxtjs/axios', {
            proxyHeaders: false,       
        }
    ], '@nuxtjs/proxy']
})
