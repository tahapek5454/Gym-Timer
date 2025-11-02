// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/image', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/google-fonts', '@nuxtjs/robots', '@nuxtjs/sitemap', '@nuxtjs/i18n', 'nuxt-seo-utils'],
  colorMode: {
    classSuffix: '',
    classPrefix: '',
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    storageKey: 'nuxt-color-mode'
  },
  routeRules:{
    '/**': { cache: { maxAge: 60 * 60 * 60 }, swr: true, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=216000, stale-while-revalidate' } },
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 700],
    },
    display: 'swap',
    download: true,
    preload: true,
    base64: true,
    inject: true,
  },
  runtimeConfig: {
    public: {
        siteUrl: 'https://gym-timer-tp.netlify.app',
    },
  },
  site:{
    name: 'Gym Timer',
    url: 'https://gym-timer-tp.netlify.app',
  },
  app:{
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Gym Timer - Antrenman Zamanlayıcı Uygulaması',
      meta: [
        { name: 'description', content: 'Spor salonunda kullanabileceğiniz profesyonel zamanlayıcı uygulaması. Antrenmanlarınızı daha verimli hale getirin.' },
        { name: 'keywords', content: 'gym timer, spor salonu zamanlayıcı, antrenman zamanlayıcı, egzersiz zamanlayıcı, workout timer' },
        { name: 'author', content: 'Gym Timer' },
        { name: 'theme-color', content: '#EEEEEE' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Gym Timer - Antrenman Zamanlayıcı Uygulaması' },
        { property: 'og:description', content: 'Spor salonunda kullanabileceğiniz profesyonel zamanlayıcı uygulaması. Antrenmanlarınızı daha verimli hale getirin.' },
        { property: 'og:locale', content: 'tr_TR' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Gym Timer - Antrenman Zamanlayıcı Uygulaması' },
        { name: 'twitter:description', content: 'Spor salonunda kullanabileceğiniz profesyonel zamanlayıcı uygulaması.' },
        // Mobile
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Gym Timer' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },
  i18n: {
    locales: [
      { code: 'tr', name: 'Türkçe', file: 'tr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    langDir: 'locales',
    defaultLocale: 'tr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  }
})