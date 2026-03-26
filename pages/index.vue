<script setup lang="ts">
const { t, locale } = useI18n()
const { config, addSuperSet, removeSuperSet, addSet, removeSet, applyToAllSets, totalSetsCount } = useWorkoutConfig()

const soundModeBool = ref(config.value.soundMode === 'voice')

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
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    window.speechSynthesis.speak(utterance)
  }
}

watch(soundModeBool, (newValue) => {
  config.value.soundMode = newValue ? 'voice' : 'music'
  if (newValue) {
    if (workAudio) { workAudio.pause(); workAudio.currentTime = 0 }
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel() }
    speakText(t('home.voiceModeSelected'))
  } else {
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel() }
    if (workAudio) { workAudio.pause(); workAudio.currentTime = 0 }
    playWorkMusic()
  }
})

onUnmounted(() => {
  if (workAudio) { workAudio.pause(); workAudio.currentTime = 0; workAudio = null }
  if ('speechSynthesis' in window) { window.speechSynthesis.cancel() }
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-lg">
      <!-- Title -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center italic">
          {{ t('home.title') }}
        </h1>
      </div>

      <!-- Top Controls -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <DarkModeButton />
          <LanguageButton />
        </div>
        <BaseSwitchButton v-model="soundModeBool" leftIcon="🔊" rightIcon="🎤" />
      </div>

      <!-- Summary Bar -->
      <div class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-3 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4 text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {{ t('home.totalSuperSets') }}: <strong class="text-gray-800 dark:text-gray-100">{{ config.superSets.length }}</strong>
          </span>
          <span class="text-gray-500 dark:text-gray-400">
            {{ t('home.totalSets') }}: <strong class="text-gray-800 dark:text-gray-100">{{ totalSetsCount }}</strong>
          </span>
        </div>
      </div>

      <!-- Super Set Cards -->
      <div class="space-y-4 mb-4">
        <SuperSetCard
          v-for="(superSet, index) in config.superSets"
          :key="index"
          :superSet="superSet"
          :superSetIndex="index"
          :canRemove="config.superSets.length > 1"
          @remove="removeSuperSet(index)"
          @addSet="addSet(index)"
          @removeSet="(setIndex: number) => removeSet(index, setIndex)"
          @applyToAll="(setIndex: number) => applyToAllSets(index, setIndex)"
        />
      </div>

      <!-- Add Super Set Button -->
      <button
        @click="addSuperSet()"
        class="w-full py-3 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ t('home.addSuperSet') }}
      </button>

      <!-- Start Button -->
      <NuxtLinkLocale
        to="/timer"
        class="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 text-center text-lg shadow-lg"
      >
        {{ t('home.startButton') }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>