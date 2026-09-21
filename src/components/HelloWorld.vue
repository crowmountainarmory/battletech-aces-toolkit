<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <section class="mx-auto max-w-2xl rounded-3xl border border-violet-300/20 bg-[#1a1824]/80 p-10 text-violet-50 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
    <h1 class="text-4xl font-black tracking-[-0.04em]">Get started</h1>
    <p class="mt-4 text-slate-300">Edit <code class="rounded bg-slate-800 px-1 py-0.5 text-violet-200">src/App.vue</code> and save to test HMR.</p>
    <button
      type="button"
      class="mt-6 inline-flex items-center justify-center rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-500 to-violet-400 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5"
      @click="count++"
    >
      Count is {{ count }}
    </button>
  </section>
</template>
