<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
    <button
        :class="['px-8 py-4 font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 focus:scale-100 focus:outline-none', $attrs.class]"
        v-bind="{ ...$attrs, class: undefined }">
        <slot />
    </button>
</template>