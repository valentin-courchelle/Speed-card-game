<script setup lang="ts">
import {ref} from 'vue'
import { useGameStore } from './stores/game.store'
import { computed } from 'vue'
import CenterPile from './components/CenterPile.vue';
import PlayerHand from './components/PlayerHand.vue';

const game = useGameStore();

const currentPlayerId = 'player1'

const currentPlayer = computed(() => {
  return game.players?.[currentPlayerId] ?? null
})


const selectedCard = ref<{
  playerId: string
  cardIndex: number
} | null>(null)

const invalidSelection = ref(false);


function onCardSelected(payload: {
  playerId: string
  cardIndex: number | null
}) {
  if (payload.cardIndex === null) {
    selectedCard.value = null
    return
  }

  selectedCard.value = {
    playerId: payload.playerId,
    cardIndex: payload.cardIndex
  }
}

function onPileSelected(pileIndex: 0 | 1) {
  if (!selectedCard.value) return

  const success = game.playCard(
    selectedCard.value.playerId,
    selectedCard.value.cardIndex,
    pileIndex
  )

  if(!success) {
    //Invalid play feedback
    invalidSelection.value = true;
    setTimeout(() => {
      invalidSelection.value = false;
    }, 400);
    return;
  }

  // reset UI selection
  selectedCard.value = null
}


</script>
<template>
  <PlayerHand
    v-if="currentPlayer"
    :cards="currentPlayer.revealed"
    :playerId="currentPlayerId"
    :invalid="invalidSelection"
    @card-selected="onCardSelected"
  />
  <div class="center">
    <CenterPile
      v-for="(card, index) in game.centerPiles"
      :key="index"
      :card="card"
      :pileIndex="index as 0 | 1"
      @select-pile="onPileSelected"
    />
  </div>
</template>


v-if="currentPlayer"
    :cards="currentPlayer.revealed"
    :playerId="currentPlayerId"
    @card-selected="onCardSelected"