import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { createGameEngine, tryPlayCard } from '../game/engine/gameEngine'
import { startAIScheduler } from '../game/ai/aiScheduler'
import { createInitialGameState } from '../game/setup/gameSetup'


export interface Card {
  id: string
  rank: number
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
}

export interface PlayerState {
  deck: Card[]
  revealed: Card[]
}

export interface GameState {
  centerPiles: [Card, Card]
  players: Record<string, PlayerState>
  status: 'playing' | 'blocked' | 'finished'
}

export const useGameStore = defineStore('game', () => {
  // engine singleton
  const engine = reactive(createGameEngine(createInitialGameState()))

  // AI scheduler
  let aiIntervalId: number | null = null

  function startAI() {
    if (aiIntervalId !== null) return

    aiIntervalId = startAIScheduler(
      engine,
      'player2', // joueur IA
      400        // difficulté (ms)
    )
  }

  function stopAI() {
    if (aiIntervalId !== null) {
      clearInterval(aiIntervalId)
      aiIntervalId = null
    }
  }


  function playCard(playerId: string, cardId: string, pileIndex: 0 | 1): boolean {
    return tryPlayCard(engine, playerId, cardId, pileIndex)
  }

  return {
    engine,
    playCard,
    startAI,
    stopAI
  }
})
