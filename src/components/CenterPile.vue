<script setup lang="ts">
import type { Card } from '../stores/game.store'
import CardComponent from './Card.vue'

const props = defineProps<{
  card: Card
  pileIndex: 0 | 1
}>()

const emit = defineEmits<{
  (e: 'select-pile', pileIndex: 0 | 1): void
}>()

function onClick() {
  emit('select-pile', props.pileIndex)
}
</script>

<template>
  <div class="pile" @click="onClick">
    <CardComponent :card="card" />
  </div>
</template>

<style scoped>
.pile {
  cursor: pointer;
}
</style>
