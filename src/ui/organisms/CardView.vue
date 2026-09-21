<script setup lang="ts">
import cn from 'classnames'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    orientation?: 'portrait' | 'landscape'
    allowFlip?: boolean
    initialFlipped?: boolean
  }>(),
  {
    orientation: 'portrait',
    allowFlip: true,
    initialFlipped: false,
  },
)

const isFlipped = ref(props.initialFlipped)

watch(
  () => props.initialFlipped,
  (nextValue) => {
    isFlipped.value = nextValue
  },
)

const cardClass = computed(() =>
  cn('relative [perspective:1200px]', {
    'h-[324px] w-[228px]': props.orientation === 'portrait',
    'h-[228px] w-[324px]': props.orientation === 'landscape',
  }),
)

const innerStyle = computed(() => ({
  transform: isFlipped.value ? 'rotateY(180deg)' : 'rotateY(0deg)',
}))

function toggleFlip(): void {
  if (!props.allowFlip) {
    return
  }

  isFlipped.value = !isFlipped.value
}
</script>

<template>
  <div :class="cardClass">
    <div class="relative h-full w-full rounded-[18px] [transform-style:preserve-3d] transition-transform duration-300" :style="innerStyle">
      <div class="absolute inset-0 overflow-hidden rounded-[18px] border border-violet-300/30 bg-[#181524] shadow-[0_18px_36px_rgba(0,0,0,0.24)]" style="backface-visibility: hidden">
        <slot name="front" />
      </div>
      <div class="absolute inset-0 overflow-hidden rounded-[18px] border border-violet-300/30 bg-[#181524] shadow-[0_18px_36px_rgba(0,0,0,0.24)]" style="transform: rotateY(180deg); backface-visibility: hidden">
        <slot name="back" />
      </div>
    </div>

    <button
      v-if="allowFlip"
      class="absolute bottom-2.5 right-2.5 z-20 grid h-7 w-7 place-items-center rounded-full border border-violet-200/30 bg-[#100f16]/90 text-violet-50 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300"
      type="button"
      :aria-label="isFlipped ? 'Flip card to front' : 'Flip card to back'"
      @click="toggleFlip"
    >
      <svg v-if="!isFlipped" viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="h-3.5 w-3.5 fill-current">
        <path d="M9 7H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4v-2H5V9h4V7zm6 0V5h-2v2h2zm-2 10h2v-2h-2v2zm8 2h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2v2h2v10h-2v2zm0-12h2V5h-2v2zm-8 4h8V9h-8v2zm0 4h8v-2h-8v2z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="h-3.5 w-3.5 fill-current">
        <path d="M9 7H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4v-2H5V9h4V7zm6 0h-2V5h2v2zm-4 10h2v-2h-2v2zm8 2h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2v2h2v10h-2v2zm0-12h2V5h-2v2zm-8 4h8V9h-8v2zm0 4h8v-2h-8v2z" />
      </svg>
    </button>
  </div>
</template>
