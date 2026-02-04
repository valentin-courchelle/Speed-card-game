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
  padding: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.15s ease;
}

.pile:hover {
  background: rgba(255, 255, 255, 0.08);
}

</style>
