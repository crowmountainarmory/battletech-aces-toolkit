<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { DeckSummaryDto } from '../../infrastructure/indexeddb/dto/deck'
import { listDecks } from '../../infrastructure/indexeddb/repositories/deckRepository'

const decks = ref<DeckSummaryDto[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const hasDecks = computed(() => decks.value.length > 0)

async function loadDecks(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    decks.value = await listDecks()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load saved decks right now.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadDecks()
})
</script>

<template>
  <main class="grid min-h-screen place-items-center px-5 py-12">
    <section class="w-full max-w-3xl rounded-3xl border border-violet-300/20 bg-[#1a1824]/90 p-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p class="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-violet-300">
        BattleTech Alpha Strike Aces Toolkit
      </p>
      <p class="mt-5 max-w-2xl text-[1.0625rem] text-slate-300">
        Start a new deck for custom card authoring, or reopen one of your saved decks and
        continue refining its rules.
      </p>

      <div class="mt-8 flex flex-wrap gap-4">
        <RouterLink
          class="inline-flex items-center justify-center rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-500 to-violet-400 px-5 py-3 font-semibold text-white no-underline transition duration-150 hover:-translate-y-0.5 hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          to="/deck/new"
        >
          Create New Deck
        </RouterLink>

        <details v-if="hasDecks" class="relative">
          <summary
            class="list-none cursor-pointer rounded-xl border border-violet-300/40 bg-violet-500/10 px-5 py-3 font-semibold text-violet-50 transition duration-150 hover:-translate-y-0.5 hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            Load Existing Deck
          </summary>

          <div class="absolute left-0 top-full z-10 mt-3 w-[min(28rem,calc(100vw-40px))] rounded-3xl border border-violet-300/40 bg-[#171521] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p class="mb-3 font-bold text-violet-50">Recent decks</p>
            <ul class="grid max-h-80 gap-2.5 overflow-y-auto p-0" aria-label="Saved decks">
              <li v-for="deck in decks" :key="deck.id" class="min-h-[3.3rem]">
                <RouterLink
                  :to="`/deck/${deck.id}`"
                  class="flex flex-col gap-1 rounded-xl border border-violet-300/20 bg-white/5 px-3.5 py-3 text-left no-underline transition hover:border-violet-200 hover:bg-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <span class="font-bold text-violet-50">{{ deck.name }}</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </details>
      </div>

      <p v-if="isLoading" class="mt-5 text-slate-300">Loading saved decks...</p>
      <p v-else-if="!hasDecks" class="mt-5 text-slate-300">
        No saved decks yet. Create one to get started.
      </p>
      <p v-if="errorMessage" class="mt-5 text-red-300">{{ errorMessage }}</p>
    </section>
  </main>
</template>
