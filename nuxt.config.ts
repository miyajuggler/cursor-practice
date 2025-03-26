export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: false },
  compatibilityDate: "2025-03-25",
});