<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  leftIcon?: string
  rightIcon?: string
  iconClass?: string
  modelValue?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
    <div class="flex items-center gap-3">
        <!-- Sol Icon -->
        <span v-if="leftIcon" :class="['text-2xl transition-opacity', iconClass, modelValue ? 'opacity-50' : 'opacity-100']">
            {{ leftIcon }}
        </span>

        <!-- iOS Tarzı Switch -->
        <button
            type="button"
            role="switch"
            :aria-checked="modelValue"
            @click="$emit('update:modelValue', !modelValue)"
            :class="[
                'relative inline-flex h-6 w-11 sm:h-8 sm:w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none',
                modelValue ? 'bg-green-500' : 'bg-gray-300',
                $attrs.class
            ]"
            v-bind="{ ...$attrs, class: undefined }">
            <!-- Slider -->
            <span
                :class="[
                    'inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out',
                    modelValue ? 'translate-x-5 sm:translate-x-7' : 'translate-x-1'
                ]"
            />
        </button>

        <!-- Sağ Icon -->
        <span v-if="rightIcon" :class="['text-2xl transition-opacity', iconClass, modelValue ? 'opacity-100' : 'opacity-50']">
            {{ rightIcon }}
        </span>
    </div>
</template>