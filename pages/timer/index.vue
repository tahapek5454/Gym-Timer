<script setup lang="ts">
const i18n = useI18n()
const { t } = i18n
const localePath = useLocalePath()
const { config } = useWorkoutConfig()

// Redirect to home if config is empty
if (!config.value.superSets.length) {
  navigateTo(localePath('/'))
}

// Phase types: 'work' | 'setRest' | 'superSetRest'
type Phase = 'work' | 'setRest' | 'superSetRest'

const currentSuperSetIndex = ref(0)
const currentSetIndex = ref(0)
const currentPhase = ref<Phase>('work')
const timeLeft = ref(0)
const isRunning = ref(false)
const isPaused = ref(false)
const isEnd = ref(false)
const soundMode = ref(config.value.soundMode)

let intervalId: ReturnType<typeof setInterval> | null = null

// Current set/superset helpers
const currentSuperSet = computed(() => config.value.superSets[currentSuperSetIndex.value])
const currentSet = computed(() => currentSuperSet.value?.sets[currentSetIndex.value])
const totalSuperSets = computed(() => config.value.superSets.length)
const totalSetsInCurrentSuperSet = computed(() => currentSuperSet.value?.sets.length ?? 0)

const isLastSetInSuperSet = computed(() => currentSetIndex.value >= totalSetsInCurrentSuperSet.value - 1)
const isLastSuperSet = computed(() => currentSuperSetIndex.value >= totalSuperSets.value - 1)

const currentSetDuration = computed(() => currentSet.value?.duration ?? 0)
const currentRestDuration = computed(() => currentSet.value?.restDuration ?? 30)
const currentSuperSetRestDuration = computed(() => currentSuperSet.value?.restAfterSuperSet ?? 120)

// Audio
const workAudio = ref<HTMLAudioElement | null>(null)
const restAudio = ref<HTMLAudioElement | null>(null)
const endAudio = ref<HTMLAudioElement | null>(null)
let currentAudio: HTMLAudioElement | null = null

const initAudio = () => {
  if (!workAudio.value) {
    workAudio.value = new Audio('/sounds/work.mp3')
    workAudio.value.volume = 0.7
    workAudio.value.load()
  }
  if (!restAudio.value) {
    restAudio.value = new Audio('/sounds/rest.mp3')
    restAudio.value.volume = 0.7
    restAudio.value.load()
  }
  if (!endAudio.value) {
    endAudio.value = new Audio('/sounds/end.mp3')
    endAudio.value.volume = 0.7
    endAudio.value.load()
  }
}

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = i18n.locale.value === 'tr' ? 'tr-TR' : 'en-US'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    window.speechSynthesis.speak(utterance)
  }
}

const playSound = (soundType: 'work' | 'rest' | 'superSetRest' | 'end') => {
  if (soundMode.value === 'off') return

  if (soundMode.value === 'voice') {
    let textToSpeak = ''
    if (soundType === 'work') textToSpeak = t('timer.voiceCommands.work')
    else if (soundType === 'rest') textToSpeak = t('timer.voiceCommands.rest')
    else if (soundType === 'superSetRest') textToSpeak = t('timer.voiceCommands.superSetRest')
    else if (soundType === 'end') textToSpeak = t('timer.voiceCommands.end')
    speakText(textToSpeak)
  } else if (soundMode.value === 'music') {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0 }
    let audioToPlay: HTMLAudioElement | null = null
    if (soundType === 'work' && workAudio.value) audioToPlay = workAudio.value
    else if ((soundType === 'rest' || soundType === 'superSetRest') && restAudio.value) audioToPlay = restAudio.value
    else if (soundType === 'end' && endAudio.value) audioToPlay = endAudio.value
    if (audioToPlay) {
      currentAudio = audioToPlay
      audioToPlay.currentTime = 0
      audioToPlay.play().catch(err => console.error('Ses çalma hatası:', err))
    }
  }
}

const toggleSound = () => {
  if (soundMode.value === 'off') {
    soundMode.value = config.value.soundMode === 'off' ? 'voice' : config.value.soundMode
  } else {
    soundMode.value = 'off'
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0 }
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel() }
  }
}

// Timer control
const stopInterval = () => {
  if (intervalId) { clearInterval(intervalId); intervalId = null }
}

const startInterval = () => {
  if (currentSetDuration.value === 0 && currentPhase.value === 'work') return
  isPaused.value = false
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleTimeEnd()
    }
  }, 1000)
}

const switchToWork = () => {
  currentPhase.value = 'work'
  timeLeft.value = currentSetDuration.value
  playSound('work')
  if (currentSetDuration.value > 0) startInterval()
}

const switchToSetRest = () => {
  currentPhase.value = 'setRest'
  timeLeft.value = currentRestDuration.value
  playSound('rest')
  startInterval()
}

const switchToSuperSetRest = () => {
  currentPhase.value = 'superSetRest'
  timeLeft.value = currentSuperSetRestDuration.value
  playSound('superSetRest')
  startInterval()
}

const moveToNextSet = () => {
  currentSetIndex.value++
  switchToWork()
}

const moveToNextSuperSet = () => {
  currentSuperSetIndex.value++
  currentSetIndex.value = 0
  switchToWork()
}

const endTimer = () => {
  stopInterval()
  isRunning.value = false
  playSound('end')
  isEnd.value = true
}

const handleTimeEnd = () => {
  stopInterval()

  if (currentPhase.value === 'work') {
    // After work phase
    if (isLastSetInSuperSet.value) {
      if (isLastSuperSet.value) {
        endTimer()
      } else {
        switchToSuperSetRest()
      }
    } else {
      switchToSetRest()
    }
  } else if (currentPhase.value === 'setRest') {
    moveToNextSet()
  } else if (currentPhase.value === 'superSetRest') {
    moveToNextSuperSet()
  }
}

const startTimer = () => {
  if (soundMode.value === 'music') initAudio()
  isRunning.value = true
  isPaused.value = false
  currentPhase.value = 'work'
  timeLeft.value = currentSetDuration.value
  playSound('work')
  startInterval()
}

const nextPhase = () => {
  stopInterval()
  handleTimeEnd()
}

const togglePause = () => {
  if (isPaused.value) {
    isPaused.value = false
    startInterval()
  } else {
    isPaused.value = true
    stopInterval()
  }
}

const resetTimer = () => {
  stopInterval()
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null }
  currentSuperSetIndex.value = 0
  currentSetIndex.value = 0
  currentPhase.value = 'work'
  timeLeft.value = 0
  isRunning.value = false
  isPaused.value = false
  isEnd.value = false
}

// Display helpers
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progressPercent = computed(() => {
  let total = 0
  if (currentPhase.value === 'work') total = currentSetDuration.value
  else if (currentPhase.value === 'setRest') total = currentRestDuration.value
  else if (currentPhase.value === 'superSetRest') total = currentSuperSetRestDuration.value
  if (total === 0) return 0
  return ((total - timeLeft.value) / total) * 100
})

const phaseColor = computed(() => {
  if (currentPhase.value === 'work') return 'green'
  if (currentPhase.value === 'setRest') return 'blue'
  return 'purple'
})

const strokeColor = computed(() => {
  if (currentPhase.value === 'work') return '#10B981'
  if (currentPhase.value === 'setRest') return '#3B82F6'
  return '#8B5CF6'
})

const phaseLabel = computed(() => {
  if (currentPhase.value === 'work') return t('timer.workTime')
  if (currentPhase.value === 'setRest') return t('timer.restTime')
  return t('timer.superSetRestTime')
})

const isUnlimitedWork = computed(() => currentSetDuration.value === 0 && currentPhase.value === 'work')

const skipButtonLabel = computed(() => {
  if (currentPhase.value === 'work') {
    if (isLastSetInSuperSet.value && !isLastSuperSet.value) return t('timer.goToRest')
    if (isLastSetInSuperSet.value && isLastSuperSet.value) return t('timer.finishSet')
    return t('timer.goToRest')
  }
  if (currentPhase.value === 'setRest') return t('timer.finishRest')
  return t('timer.skipSuperSetRest')
})

// Cleanup
onUnmounted(() => {
  stopInterval()
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
  if (workAudio.value) { workAudio.value.pause(); workAudio.value = null }
  if (restAudio.value) { restAudio.value.pause(); restAudio.value = null }
  if (endAudio.value) { endAudio.value.pause(); endAudio.value = null }
  if ('speechSynthesis' in window) { window.speechSynthesis.cancel() }
})

onMounted(() => {
  if (currentSetDuration.value > 0) {
    timeLeft.value = currentSetDuration.value
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="mb-6 sm:mb-8 flex items-center justify-between">
        <NuxtLinkLocale to="/" class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="0.5">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </NuxtLinkLocale>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 italic">{{ t('gymTimer') }}</h1>
        <button @click="toggleSound" class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors p-1">
          <svg v-if="soundMode !== 'off'" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10 overflow-hidden transition-colors duration-200">
        <!-- Super Set / Set Progress -->
        <div class="text-center mb-6">
          <div class="flex items-center justify-center gap-4 mb-2">
            <div>
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{{ t('timer.superSet') }}</div>
              <div class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {{ currentSuperSetIndex + 1 }} / {{ totalSuperSets }}
              </div>
            </div>
            <div class="w-px h-10 bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{{ t('timer.set') }}</div>
              <div class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {{ currentSetIndex + 1 }} / {{ totalSetsInCurrentSuperSet }}
              </div>
            </div>
          </div>
        </div>

        <!-- Phase Badge -->
        <div class="flex justify-center mb-6">
          <div :class="[
              'px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300',
              currentPhase === 'work'
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-600'
                : currentPhase === 'setRest'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600'
                  : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600'
            ]">
            {{ phaseLabel }}
          </div>
        </div>

        <!-- Circular Timer -->
        <div class="relative mb-8">
          <div class="flex justify-center items-center">
            <div class="relative">
              <svg class="transform -rotate-90 w-64 h-64 sm:w-80 sm:h-80">
                <circle cx="50%" cy="50%" r="120" stroke="#E5E7EB" class="dark:stroke-gray-700" stroke-width="12" fill="none" />
                <circle cx="50%" cy="50%" r="120" :stroke="strokeColor" stroke-width="12"
                  fill="none" :stroke-dasharray="2 * Math.PI * 120"
                  :stroke-dashoffset="2 * Math.PI * 120 * (1 - progressPercent / 100)"
                  class="transition-all duration-300 ease-linear" stroke-linecap="round" />
              </svg>

              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div v-if="!isRunning" class="text-6xl sm:text-7xl font-bold text-gray-800 dark:text-gray-100">
                  {{ isUnlimitedWork ? '--:--' : formattedTime }}
                </div>
                <div v-else class="text-6xl sm:text-7xl font-bold" :class="{
                    'text-green-600 dark:text-green-400': currentPhase === 'work',
                    'text-blue-600 dark:text-blue-400': currentPhase === 'setRest',
                    'text-purple-600 dark:text-purple-400': currentPhase === 'superSetRest'
                  }">
                  {{ isUnlimitedWork ? '--:--' : formattedTime }}
                </div>
                <div v-if="isUnlimitedWork && isRunning" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {{ t('timer.unlimited') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Screen -->
        <div v-if="isEnd" class="text-center mb-8">
          <div class="text-3xl mb-4">🎉</div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t('timer.congratulations') }}</h2>
          <p class="text-gray-600 dark:text-gray-400">{{ t('timer.allSetsCompleted') }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Start Button -->
          <BaseButton v-if="!isRunning && !isEnd" @click="startTimer"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white col-span-2">
            {{ t('timer.start') }}
          </BaseButton>

          <!-- Pause/Continue -->
          <BaseButton v-if="isRunning && !isUnlimitedWork && !isEnd" @click="togglePause" :class="isPaused
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white'
              : 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white'" class="col-span-2 sm:col-span-1">
            {{ isPaused ? t('timer.continue') : t('timer.pause') }}
          </BaseButton>

          <!-- Skip (unlimited work) -->
          <BaseButton v-if="isRunning && isUnlimitedWork && !isEnd" @click="nextPhase"
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white col-span-2 sm:col-span-1">
            {{ skipButtonLabel }}
          </BaseButton>

          <!-- Reset -->
          <BaseButton v-if="isRunning || isEnd" @click="resetTimer"
            :class="`bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white col-span-2 ${isEnd ? 'sm:col-span-2' : 'sm:col-span-1'}`">
            {{ t('timer.reset') }}
          </BaseButton>

          <!-- Restart (after end) -->
          <BaseButton v-if="isEnd" @click="resetTimer(); startTimer()"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white col-span-2">
            {{ t('timer.restart') }}
          </BaseButton>

          <!-- Skip/Finish phase (timed) -->
          <BaseButton v-if="isRunning && !isEnd && !isUnlimitedWork" @click="nextPhase"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white col-span-2">
            {{ skipButtonLabel }}
          </BaseButton>
        </div>

        <!-- Info Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('timer.totalSuperSets') }}</div>
              <div class="font-semibold text-gray-800 dark:text-gray-200">{{ totalSuperSets }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('timer.totalSets') }}</div>
              <div class="font-semibold text-gray-800 dark:text-gray-200">{{ totalSetsInCurrentSuperSet }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('timer.work') }}</div>
              <div class="font-semibold text-gray-800 dark:text-gray-200">{{ currentSetDuration === 0 ? t('timer.unlimited') : currentSetDuration + t('timer.seconds') }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('timer.rest') }}</div>
              <div class="font-semibold text-gray-800 dark:text-gray-200">{{ currentRestDuration }}{{ t('timer.seconds') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>