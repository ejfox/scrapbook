import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    publicRuntimeConfig: {
        head: {
            link: [
                // tachyons
                { rel: 'stylesheet', href: 'https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css' },
            ]
        }
    },
    modules: [
        ['@nuxtjs/axios', {
            proxyHeaders: false,       
        }
    ], '@nuxtjs/proxy']
})
