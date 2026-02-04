<script setup lang="ts">
import {ref} from 'vue'
import { useGameStore } from './stores/game.store'
import { computed } from 'vue'
import CenterPile from './components/CenterPile.vue';
import PlayerHand from './components/PlayerHand.vue';

const game = useGameStore();

game.startAI();

const currentPlayerId = 'player1'
const aiPlayerId = 'player2'

const currentPlayer = computed(() => {
  return game.engine.players[currentPlayerId] ?? null
})

const aiPlayer = computed(() => {
  return game.engine.players[aiPlayerId] ?? null
})


const selectedCard = ref<{
  playerId: string
  cardId: string
} | null>(null)

const invalidSelection = ref(false);


function onCardSelected(payload: {
  playerId: string
  cardId: string | null
}) {
  if (payload.cardId === null) {
    selectedCard.value = null
    return
  }

  selectedCard.value = {
    playerId: payload.playerId,
    cardId: payload.cardId
  }
}

function onPileSelected(pileIndex: 0 | 1) {
  if (!selectedCard.value) return

  const success = game.playCard(
    selectedCard.value.playerId,
    selectedCard.value.cardId,
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
  <div class="board">
    <PlayerHand
      v-if="aiPlayer"
      :cards="aiPlayer.revealed"
      :playerId="aiPlayerId"
      :invalid="invalidSelection"
      @card-selected="onCardSelected"
    />

    <div class="center-row">
      <CenterPile
        v-for="(card, index) in game.engine.centerPiles"
        :key="index"
        :card="card"
        :pileIndex="index as 0 | 1"
        @select-pile="onPileSelected"
      />
    </div>

    <PlayerHand
      v-if="currentPlayer"
      :cards="currentPlayer.revealed"
      :playerId="currentPlayerId"
      :invalid="invalidSelection"
      @card-selected="onCardSelected"
    />
  </div>
</template>

<style scoped>
  .board {
    min-height: 100vh;
    background: radial-gradient(circle at center, #1e1e1e, #0d0d0d);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32px;
}

  .center-row {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin: 40px 0;
  }

</style>