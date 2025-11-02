<script setup lang="ts">
const { t , locale} = useI18n()
const setCount = ref<number>(3)
const setDuration = ref<number>(0)
const restDuration = ref<number>(60)
const soundModeBool = ref(true)


let workAudio: HTMLAudioElement | null = null

const playWorkMusic = () => {
  if (workAudio) {
    workAudio.pause()
    workAudio.currentTime = 0
  }
  workAudio = new Audio('/sounds/work.mp3')
  workAudio.play().catch(err => console.log('Ses çalma hatası:', err))
}

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
  
    utterance.lang = locale.value === 'tr' ? 'tr-TR' : 'en-US'
    utterance.rate = 1.0 // Konuşma hızı
    utterance.pitch = 1.0 // Ses tonu
    utterance.volume = 1.0 // Ses seviyesi
    
    window.speechSynthesis.speak(utterance)
  }
}

watch(soundModeBool, (newValue) => {
  if (newValue) {
    let selectedModeMessage = t('home.voiceModeSelected')
    if (workAudio) {
      workAudio.pause()
      workAudio.currentTime = 0
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    speakText(selectedModeMessage)
  }
  else {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (workAudio) {
      workAudio.pause()
      workAudio.currentTime = 0
    }
    playWorkMusic()
  }
})

onUnmounted(() => {
  if (workAudio) {
    workAudio.pause()
    workAudio.currentTime = 0
    workAudio = null
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-lg">
      <div class="mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center italic">
          {{ t('home.title') }}
        </h1>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-200">
        <div class="w-full flex justify-end space-x-2 items-center">
          <DarkModeButton />
          <LanguageButton />
        </div>
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('home.setCount') }}
            </label>
            <input v-model.number="setCount" type="number" min="1"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              :placeholder="t('home.setCountPlaceholder')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('home.setDuration') }}
            </label>
            <input v-model.number="setDuration" type="number" min="0"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              :placeholder="t('home.setDurationPlaceholder')" />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('home.setDurationInfo') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('home.restDuration') }}
            </label>
            <input v-model.number="restDuration" type="number" min="0"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              :placeholder="t('home.restDurationPlaceholder')" />
          </div>

          <div class="w-full flex justify-end gap-2">
            <BaseSwitchButton v-model="soundModeBool" leftIcon="🔊" rightIcon="🎤" />
          </div>

          <NuxtLinkLocale :to="{
              path: '/timer',
              query: {
                setCount: setCount,
                setDuration: setDuration,
                restDuration: restDuration,
                soundMode: soundModeBool ? 'voice' : 'music'
              }
            }"
            class="block w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 text-center">
            {{ t('home.startButton') }}
          </NuxtLinkLocale>

        </div>
      </div>
    </div>
  </div>
</template>