<script setup lang="ts">
import type { Card } from '../stores/game.store'
import CardComponent from './Card.vue'

const props = defineProps<{
  card: Card
  cardIndex: number
  playerId: string
  selected: boolean
  invalid: boolean
}>()

const emit = defineEmits<{
  (e: 'select', payload: {
    cardIndex: number
  }): void
}>()

function onClick() {
  emit('select', { cardIndex: props.cardIndex })
}
</script>

<template>
  <div
    class="playable"
    :class="{ selected, invalid }"
    @click="onClick"
  >
    <CardComponent :card="card" />
  </div>
</template>

<style scoped>
.playable {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.playable:not(.selected):hover {
  transform: translateY(-6px);
}

.playable.selected {
  transform: translateY(-12px);
  box-shadow: 0 0 0 3px #42b883;
}

/* INVALID STATE */
.playable.invalid {
  box-shadow: 0 0 0 3px #e74c3c;
  animation: shake 0.4s;
}

@keyframes shake {
  0%   { transform: translateY(-12px) translateX(0); }
  20%  { transform: translateY(-12px) translateX(-4px); }
  40%  { transform: translateY(-12px) translateX(4px); }
  60%  { transform: translateY(-12px) translateX(-4px); }
  80%  { transform: translateY(-12px) translateX(4px); }
  100% { transform: translateY(-12px) translateX(0); }
}
</style>
