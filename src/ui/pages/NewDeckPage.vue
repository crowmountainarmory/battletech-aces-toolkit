<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { createDeck } from '../../infrastructure/indexeddb/repositories/deckRepository'

const router = useRouter()

const name = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const isNameValid = computed(() => name.value.trim().length > 0)

async function handleSubmit(): Promise<void> {
  if (!isNameValid.value || isSubmitting.value) {
    if (!isNameValid.value) {
      errorMessage.value = 'Enter a deck name before creating it.'
    }

    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const deck = await createDeck({ name: name.value })
    await router.push(`/deck/${deck.id}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to create the deck.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center px-5 py-12">
    <section class="w-full max-w-3xl rounded-[24px] border border-violet-300/20 bg-[#1a1824]/90 p-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p class="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-violet-300">New Deck</p>
      <h1 class="text-5xl font-black tracking-[-0.04em] text-violet-50 md:text-6xl">Create a deck</h1>
      <p class="mt-5 max-w-2xl text-[1.0625rem] text-slate-300">
        Give your deck a name now. You can add cards, rules, and integrations after the deck is
        created.
      </p>

      <form class="mt-8" @submit.prevent="handleSubmit">
        <label class="grid gap-2.5 text-violet-50">
          <span class="font-semibold">Deck name</span>
          <input
            v-model="name"
            class="w-full rounded-xl border border-violet-300/40 bg-[#0c0b12]/70 px-4 py-3.5 text-violet-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            type="text"
            name="name"
            autocomplete="off"
            placeholder="Wolf's Dragoons Command Deck"
          />
        </label>

        <p v-if="errorMessage" class="mt-5 text-red-300">{{ errorMessage }}</p>

        <div class="mt-8 flex flex-wrap gap-4">
          <button
            class="inline-flex items-center justify-center rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-500 to-violet-400 px-5 py-3 font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:border-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating Deck...' : 'Create Deck' }}
          </button>
          <RouterLink
            class="inline-flex items-center justify-center rounded-xl border border-violet-300/40 bg-violet-500/10 px-5 py-3 font-semibold text-violet-50 no-underline transition duration-150 hover:-translate-y-0.5 hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            to="/"
          >
            Back
          </RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>
