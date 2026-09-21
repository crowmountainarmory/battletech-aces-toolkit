<script setup lang="ts">
defineProps<{
  label?: string
  items?: string[]
}>()

function renderList(items?: string[]): string {
  return items && items.length > 0 ? items.join(' • ') : '—'
}
</script>

<template>
  <div class="grid min-w-0 gap-1.5">
    <p v-if="label" class="m-0 text-[0.56rem] uppercase tracking-[0.1em] text-violet-200">
      {{ label }}
    </p>
    <div class="break-words text-[0.68rem] leading-[1.45] text-violet-50">
      {{ renderList(items) }}
    </div>
  </div>
</template>
