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
    cardId: string
  }): void
}>()

// Local UI state (not game state!)
const selectedCardId = ref<string | null>(null)

function onSelectCard(payload: { cardId: string }) {
  selectedCardId.value =
    selectedCardId.value === payload.cardId
      ? null
      : payload.cardId

  if (selectedCardId.value !== null) {
    emit('card-selected', {
      playerId,
      cardId: selectedCardId.value
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
      :cardId="card.id"
      :playerId="playerId"
      :selected="card.id === selectedCardId"
      :invalid="invalid && card.id === selectedCardId"
      @select="onSelectCard"
    />
  </div>
</template>

<style scoped>
.hand {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding-bottom: 24px;
}

</style>
