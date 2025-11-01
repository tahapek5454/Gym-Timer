<template>
    <button
      @click="toggleLanguage"
      class="bg-white hover:bg-gray-100 rounded-lg shadow-md border border-gray-300 px-3 py-2 transition-all duration-200 active:scale-95"
      :title="locale === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'"
    >
      <span class="text-sm font-semibold text-gray-700">
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