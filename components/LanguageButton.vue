<template>
    <button
      @click="toggleLanguage"
      class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-all duration-200 active:scale-95"
      :title="locale === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'"
    >
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {{ locale.toUpperCase() }}
      </span>
    </button>
</template>

<script lang="ts" setup>
const { locale, setLocale } = useI18n()

const toggleLanguage = () => {
  const newLocale = locale.value === 'tr' ? 'en' : 'tr'
  setLocale(newLocale)
}
</script>