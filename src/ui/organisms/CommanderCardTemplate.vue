<script setup lang="ts">
import RuleListField from '../atoms/RuleListField.vue'
import CardView from './CardView.vue'

defineProps<{
  commander: any
  mode: any
  initialFlipped?: boolean
}>()
</script>

<template>
  <CardView orientation="portrait" :initial-flipped="initialFlipped ?? false">
    <template #front>
      <div class="relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-gradient-to-b from-[#11111c]/95 to-[#2a2437]/95 p-3.5 text-violet-50 before:absolute before:inset-2 before:rounded-xl before:border before:border-violet-300/30">
        <div class="relative z-10 flex items-start justify-between gap-2.5">
          <div>
            <h3 class="m-0 text-[1.2rem] leading-[1.1]">{{ commander.name }}</h3>
          </div>
          <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-300 text-sm font-extrabold text-white">{{ mode.mode }}</span>
        </div>

        <p class="relative z-10 mb-3 mt-1 text-[0.7rem] uppercase tracking-[0.08em] text-slate-300">
          {{ commander.faction }}
        </p>

        <div class="relative z-10 mt-3">
          <RuleListField label="Orders" :items="mode.orders" />
        </div>

        <div class="relative z-10 mt-3 grid grid-cols-3 gap-2.5">
          <div class="grid min-w-0 gap-1.5">
            <RuleListField label="Red" :items="mode.redTargetFilters" />
          </div>
          <div class="grid min-w-0 gap-1.5">
            <RuleListField label="Yellow" :items="mode.yellowTargetFilters" />
          </div>
          <div class="grid min-w-0 gap-1.5">
            <RuleListField label="Blue" :items="mode.blueTargetFilters" />
          </div>
        </div>
      </div>
    </template>

    <template #back>
      <div class="relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-gradient-to-b from-[#11111c]/95 to-[#2a2437]/95 p-3.5 text-violet-50 before:absolute before:inset-2 before:rounded-xl before:border before:border-violet-300/30">
        <div class="relative z-10 flex items-start justify-between gap-2.5">
          <div>
            <h3 class="m-0 text-[1.2rem] leading-[1.1]">{{ commander.name }}</h3>
          </div>
          <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-300 text-sm font-extrabold text-white">{{ mode.mode }}</span>
        </div>

        <p class="relative z-10 mb-3 mt-1 text-[0.7rem] uppercase tracking-[0.08em] text-slate-300">
          {{ commander.faction }}
        </p>

        <div class="relative z-10 mt-3">
          <RuleListField label="Support Orders" :items="mode.supportOrders" />
        </div>

        <div class="relative z-10 mt-3 grid grid-cols-3 gap-2.5">
          <div class="grid min-w-0 gap-1.5">
            <RuleListField label="Emplacements" :items="mode.emplacementTargetFilters" />
          </div>
          <div class="grid min-w-0 gap-1.5">
            <RuleListField label="Artillery" :items="mode.artilleryTargetFilters" />
          </div>
          <div class="grid min-w-0 gap-1.5">
            <RuleListField label="BSP Cards" :items="mode.bspCardTargetFilters" />
          </div>
        </div>

        <div class="relative z-10 mt-3">
          <RuleListField label="Strategy Decisions" :items="mode.strategyDecisions" />
        </div>
      </div>
    </template>
  </CardView>
</template>
