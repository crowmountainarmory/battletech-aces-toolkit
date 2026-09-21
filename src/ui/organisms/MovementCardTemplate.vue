<script setup lang="ts">
import cn from 'classnames'
import { computed } from 'vue'
import RuleListField from '../atoms/RuleListField.vue'
import CardView from './CardView.vue'

const props = defineProps<{
  movementCard: any
  filters: any[]
  initialFlipped?: boolean
}>()

const movementTypeLabels: Record<string, string> = {
  G: 'Ground',
  J: 'Jump',
  S: 'Sprint',
  H: 'Standstill',
}

function movementTypeLabel(movementType: string): string {
  return movementTypeLabels[movementType] ?? movementType
}

const filterGridClass = computed(() =>
  cn('relative z-10 mt-3 grid flex-1 gap-2.5', {
    'grid-cols-1': props.filters.length <= 1,
    'grid-cols-2': props.filters.length === 2,
    'grid-cols-3': props.filters.length === 3,
    'grid-cols-4': props.filters.length >= 4,
  }),
)
</script>

<template>
  <CardView orientation="landscape" :allow-flip="false" :initial-flipped="initialFlipped ?? false">
    <template #front>
      <div class="relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-gradient-to-b from-[#11111c]/95 to-[#2a2437]/95 p-3.5 text-violet-50 before:absolute before:inset-2 before:rounded-xl before:border before:border-violet-300/30">
        <div class="relative z-10 flex items-start justify-between gap-2.5">
          <h3 class="m-0 text-[1.2rem] leading-[1.1]">{{ movementCard.unitRole }}</h3>
          <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-300 text-sm font-extrabold text-white">{{ movementCard.defaultOrderNumber }}</span>
        </div>

        <div :class="filterGridClass">
          <div
            v-for="(filter, index) in filters"
            :key="filter.id ?? index"
            class="grid min-w-0 auto-rows-min gap-1.5 rounded-lg border border-violet-300/20 bg-white/5 p-2"
          >
            <div class="flex items-center justify-between gap-1.5">
              <p class="m-0 truncate text-[0.68rem] font-semibold text-violet-50">{{ filter.label }}</p>
              <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/80 px-1 text-[0.6rem] font-bold text-white">{{ movementTypeLabel(filter.movementType) }}</span>
            </div>
            <p v-if="filter.condition" class="m-0 text-[0.6rem] italic text-violet-200">{{ filter.condition }}</p>
            <RuleListField :items="filter.actions" />
          </div>
        </div>
      </div>
    </template>

    <template #back>
      <div class="relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-gradient-to-b from-[#11111c]/95 to-[#2a2437]/95 p-3.5 text-violet-50 before:absolute before:inset-2 before:rounded-xl before:border before:border-violet-300/30">
        <div class="relative z-10 flex items-start justify-between gap-2.5">
          <h3 class="m-0 text-[1.2rem] leading-[1.1]">{{ movementCard.unitRole }}</h3>
          <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-300 text-sm font-extrabold text-white">{{ movementCard.defaultOrderNumber }}</span>
        </div>

        <div :class="filterGridClass">
          <div
            v-for="(filter, index) in filters"
            :key="filter.id ?? index"
            class="grid min-w-0 auto-rows-min gap-1.5 rounded-lg border border-violet-300/20 bg-white/5 p-2"
          >
            <div class="flex items-center justify-between gap-1.5">
              <p class="m-0 truncate text-[0.68rem] font-semibold text-violet-50">{{ filter.label }}</p>
              <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/80 px-1 text-[0.6rem] font-bold text-white">{{ movementTypeLabel(filter.movementType) }}</span>
            </div>
            <p v-if="filter.condition" class="m-0 text-[0.6rem] italic text-violet-200">{{ filter.condition }}</p>
            <RuleListField :items="filter.actions" />
          </div>
        </div>
      </div>
    </template>
  </CardView>
</template>
