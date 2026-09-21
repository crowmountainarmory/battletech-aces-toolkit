<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import CommanderCardTemplate from '../organisms/CommanderCardTemplate.vue'
import type { CommanderCardDto, CommanderModeDto } from '../../infrastructure/indexeddb/dto/card'
import type { DeckDto } from '../../infrastructure/indexeddb/dto/deck'
import { openDeck } from '../../infrastructure/indexeddb/repositories/deckRepository'

const route = useRoute()

const deck = ref<DeckDto | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const commanderCard = computed<CommanderCardDto>(() => ({
  id: 'cmd-1',
  type: 'commander',
  name: 'Alicia Mercer',
  faction: 'Wolf’s Dragoons',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const commanderMode = computed<CommanderModeDto>(() => ({
  id: 'mode-1',
  commanderCardId: commanderCard.value.id,
  mode: 'A',
  orders: ['Advance', 'Engage', 'Coordinate'],
  redTargetFilters: ['Highest Armor', 'Objective'],
  yellowTargetFilters: ['Lowest TMM', 'Lowest Armor'],
  blueTargetFilters: ['Highest PV', 'Red Command List'],
  supportOrders: ['Air Support', 'Medevac', 'Override'],
  emplacementTargetFilters: ['Objective', 'Rear Armor'],
  artilleryTargetFilters: ['Highest Structure', 'Lowest Armor'],
  bspCardTargetFilters: ['Can destroy target', 'Highest Armor Lost'],
  strategyDecisions: ['Prioritize mobility', 'Coordinate with artillery', 'Protect command line'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const deckId = computed(() => {
  const { id } = route.params
  return typeof id === 'string' ? id : ''
})

async function loadDeck(id: string): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    deck.value = id ? await openDeck(id) : null

    if (!deck.value) {
      errorMessage.value = 'Deck not found.'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load this deck.'
    deck.value = null
  } finally {
    isLoading.value = false
  }
}

watch(
  deckId,
  (id) => {
    void loadDeck(id)
  },
  { immediate: true },
)
</script>

<template>
  <main class="grid min-h-screen place-items-center px-5 py-12">
    <section class="w-full max-w-4xl rounded-[24px] border border-violet-300/20 bg-[#1a1824]/90 p-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <h1 v-if="deck" class="text-4xl font-black tracking-[-0.04em] text-violet-50 md:text-5xl">
        {{ deck.name }}
      </h1>
      <h1 v-else class="text-4xl font-black tracking-[-0.04em] text-violet-50 md:text-5xl">Deck</h1>

      <p v-if="isLoading" class="mt-5 text-slate-300">Loading deck...</p>
      <template v-else-if="deck">
        <dl class="mt-7 grid gap-4 rounded-[18px] border border-violet-300/20 bg-white/5 p-5">
          <div>
            <dt class="text-sm text-slate-300">Deck ID</dt>
            <dd class="mt-1 break-all text-violet-50">{{ deck.id }}</dd>
          </div>
          <div>
            <dt class="text-sm text-slate-300">Last saved</dt>
            <dd class="mt-1 text-violet-50">{{ new Date(deck.lastUsedAt).toLocaleString() }}</dd>
          </div>
        </dl>
      </template>
      <p v-else class="mt-5 text-red-300">{{ errorMessage }}</p>

      <div class="mt-8 grid gap-5 rounded-[18px] border border-violet-300/20 bg-white/5 p-5">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-bold text-violet-50">Commander card preview</h2>
        </div>

        <div class="flex justify-center pt-4">
          <CommanderCardTemplate :commander="commanderCard" :mode="commanderMode" :initial-flipped="false" />
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-4">
        <RouterLink
          class="inline-flex items-center justify-center rounded-xl border border-violet-300/40 bg-violet-500/10 px-5 py-3 font-semibold text-violet-50 no-underline transition duration-150 hover:-translate-y-0.5 hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          to="/"
        >
          Back to Landing
        </RouterLink>
        <RouterLink
          class="inline-flex items-center justify-center rounded-xl border border-violet-300/40 bg-violet-500/10 px-5 py-3 font-semibold text-violet-50 no-underline transition duration-150 hover:-translate-y-0.5 hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          to="/deck/new"
        >
          Create Another Deck
        </RouterLink>
      </div>
    </section>
  </main>
</template>
