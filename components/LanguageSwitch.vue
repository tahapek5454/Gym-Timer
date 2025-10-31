<template>
     <div class="fixed top-4 right-4 z-50">
            <button
              @click="toggleLanguage"
              class="group relative bg-white hover:bg-gray-50 rounded-full shadow-lg border-2 border-gray-200 p-3 transition-all duration-300"
              :title="locale === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'"
            >
              <div class="flex items-center gap-2">
                <span 
                  :class="[
                    'text-sm font-bold transition-all duration-300',
                    locale === 'tr' ? 'text-blue-600 scale-110' : 'text-gray-400 scale-90'
                  ]"
                >
                  TR
                </span>
                
                <div class="relative w-12 h-6 bg-gray-200 rounded-full transition-colors duration-300"
                     :class="locale === 'en' ? 'bg-blue-500' : 'bg-red-500'">
                  <div 
                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300"
                    :class="locale === 'en' ? 'translate-x-6' : 'translate-x-0'"
                  ></div>
                </div>
                
                <span 
                  :class="[
                    'text-sm font-bold transition-all duration-300',
                    locale === 'en' ? 'text-blue-600 scale-110' : 'text-gray-400 scale-90'
                  ]"
                >
                  EN
                </span>
              </div>
            </button>
          </div>
</template>

<script lang="ts" setup>
const { locale, setLocale } = useI18n()

const toggleLanguage = () => {
  const newLocale = locale.value === 'tr' ? 'en' : 'tr'
  setLocale(newLocale)
}
</script>