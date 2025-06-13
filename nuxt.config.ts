// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 8080
  },
  runtimeConfig: {
    public: {
      identityApiUrl: process.env.NUXT_PUBLIC_IDENTITY_API_URL,
      workspaceApiUrl: process.env.NUXT_PUBLIC_WORKSPACE_API_URL,
      projectApiUrl: process.env.NUXT_PUBLIC_PROJECT_API_URL,
      mode: process.env.NUXT_PUBLIC_MODE || 'default'
    }
  },
  app: {
    head: {
      title: 'Hexaend',
      titleTemplate: '%s — Hexaend',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/icon'
  ],
  ui: {
    colorMode: false
  }
})