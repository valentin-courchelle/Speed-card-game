<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../stores/game.store'
import PlayableCard from './PlayableCard.vue'

const {cards, playerId} = defineProps<{
  cards: Card[]
  playerId: string
  invalid: boolean
}>()

const emit = defineEmits<{
  (e: 'card-selected', payload: {
    playerId: string
    cardIndex: number
  }): void
}>()

// Local UI state (not game state!)
const selectedCardIndex = ref<number | null>(null)

function onSelectCard(payload: { cardIndex: number }) {
  selectedCardIndex.value =
    selectedCardIndex.value === payload.cardIndex
      ? null
      : payload.cardIndex

  if (selectedCardIndex.value !== null) {
    emit('card-selected', {
      playerId,
      cardIndex: selectedCardIndex.value
    })
  }
}
</script>

<template>
  <div class="hand">
    <PlayableCard
      v-for="(card, index) in cards"
      :key="index"
      :card="card"
      :cardIndex="index"
      :playerId="playerId"
      :selected="index === selectedCardIndex"
      :invalid="invalid && index === selectedCardIndex"
      @select="onSelectCard"
    />
  </div>
</template>

<style scoped>
.hand {
  display: flex;
  gap: 12px;
}
</style>
