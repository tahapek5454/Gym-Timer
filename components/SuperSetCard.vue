<script setup lang="ts">
import type { SuperSet } from '~/composables/useWorkoutConfig'

const { t } = useI18n()

const props = defineProps<{
  superSet: SuperSet
  superSetIndex: number
  canRemove: boolean
}>()

const emit = defineEmits<{
  remove: []
  addSet: []
  removeSet: [setIndex: number]
  applyToAll: [setIndex: number]
}>()

const collapsed = ref(false)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 bg-blue-50 dark:bg-gray-750 dark:bg-opacity-50 cursor-pointer select-none"
      @click="collapsed = !collapsed"
    >
      <div class="flex items-center gap-3">
        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold">
          {{ superSetIndex + 1 }}
        </span>
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          {{ t('home.superSet') }} {{ superSetIndex + 1 }}
        </h3>
        <span class="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium">
          {{ superSet.sets.length }} {{ t('home.sets') }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="canRemove"
          @click.stop="emit('remove')"
          class="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          :title="t('home.removeSuperSet')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': !collapsed }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Body -->
    <div v-show="!collapsed" class="p-4 sm:p-5 space-y-4">
      <!-- Sets -->
      <div
        v-for="(set, setIndex) in superSet.sets"
        :key="setIndex"
        class="relative bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-600"
      >
        <!-- Set Header -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t('home.set') }} {{ setIndex + 1 }}
          </span>
          <div class="flex items-center gap-1">
            <button
              @click="emit('applyToAll', setIndex)"
              class="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-xs"
              :title="t('home.applyToAll')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </button>
            <button
              v-if="superSet.sets.length > 1"
              @click="emit('removeSet', setIndex)"
              class="p-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              :title="t('home.removeSet')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Inputs Row -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {{ t('home.setDuration') }}
            </label>
            <input
              v-model.number="set.duration"
              type="number"
              min="0"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              :placeholder="t('home.setDurationPlaceholder')"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {{ t('home.restAfterSet') }}
            </label>
            <input
              v-model.number="set.restDuration"
              type="number"
              min="0"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              :placeholder="t('home.restAfterSetPlaceholder')"
            />
          </div>
        </div>
      </div>

      <!-- Add Set Button -->
      <button
        @click="emit('addSet')"
        class="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ t('home.addSet') }}
      </button>

      <!-- Super Set Rest Duration -->
      <div class="pt-3 border-t border-gray-200 dark:border-gray-600">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('home.restAfterSuperSet') }}
        </label>
        <input
          v-model.number="superSet.restAfterSuperSet"
          type="number"
          min="0"
          class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          :placeholder="t('home.restAfterSuperSetPlaceholder')"
        />
      </div>
    </div>
  </div>
</template>
