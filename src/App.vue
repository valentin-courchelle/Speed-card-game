<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useGameStore } from './stores/game.store'
  import type { Card } from './stores/game.store'
  import CenterPile from './components/CenterPile.vue'
  import PlayerHand from './components/PlayerHand.vue'
  import CardComponent from './components/Card.vue'
  import { watch } from 'vue'


  const game = useGameStore()
  game.startAI()

  const currentPlayerId = 'player1'
  const aiPlayerId = 'player2'

  const flyingCards = ref<Array<{
    flyingId: number
    card: Card
    startPos: { x: number; y: number }
    endPos: { x: number; y: number } | null
  }>>([])

  const currentPlayer = computed(() => game.engine.players[currentPlayerId] ?? null)
  const aiPlayer = computed(() => game.engine.players[aiPlayerId] ?? null)

  const selectedCard = ref<{ playerId: string; cardId: string } | null>(null)
  const invalidSelection = ref(false)

  let flyingIdCounter = 0

  watch(
    () => game.engine.lastMove,
    (move) => {
      if (!move) return

      triggerFlyingAnimation(move)
    }
  )

  function onCardSelected(payload: { playerId: string; cardId: string | null }) {
    if (!payload.cardId) {
      selectedCard.value = null
      return
    }
    // Prevent selecting another player's card
    //if (payload.playerId !== currentPlayerId) return

    selectedCard.value = { playerId: payload.playerId, cardId: payload.cardId }
  }

  function triggerFlyingAnimation(move: {
    playerId: string
    cardId: string
    pileIndex: 0 | 1
  }) {
    const { playerId, cardId, pileIndex } = move

    const cardElement = document.querySelector(`.hand[data-player-id="${playerId}"] .playable[data-card-id="${cardId}"]`) as HTMLElement

    if (!cardElement) return

    const startPos = cardElement.getBoundingClientRect()

    const centerPileElement =
      document.querySelectorAll('.pile')[pileIndex] as HTMLElement

    if (!centerPileElement) return

    const endPos = centerPileElement.getBoundingClientRect()

    const card = { ...game.engine.centerPiles[pileIndex] }

    const flyingId = flyingIdCounter++

    flyingCards.value.push({
      flyingId,
      card,
      startPos: { x: startPos.left, y: startPos.top },
      endPos: null
    })

    requestAnimationFrame(() => {
      const flying = flyingCards.value.find(f => f.flyingId === flyingId)
      if (!flying) return
      flying.endPos = { x: endPos.left, y: endPos.top }
    })

    
    game.engine.lastMove = null
  }

  function removeFlyingCard(flyingId: number) {
    flyingCards.value = flyingCards.value.filter(
      f => f.flyingId !== flyingId
    )
  }


  function onPileSelected(pileIndex: 0 | 1) {
    if (!selectedCard.value) return

    const playerId = selectedCard.value.playerId
    const cardId = selectedCard.value.cardId

    const playerCards = game.engine.players[playerId]!.revealed
    const card = playerCards.find(c => c.id === cardId)
    if (!card) return

    // jouer la carte dans le moteur
    const success = game.playCard(playerId, cardId, pileIndex)
    if (!success) {
      invalidSelection.value = true
      setTimeout(() => (invalidSelection.value = false), 400)
      return
    }

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

  <CardComponent
    v-for="f in flyingCards"
    :key="f.card.id"
    :card="f.card"
    :isFlying="true"
    :startPos="f.startPos"
    :endPos="f.endPos"
    @animation-end="removeFlyingCard(f.flyingId)"
  />
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