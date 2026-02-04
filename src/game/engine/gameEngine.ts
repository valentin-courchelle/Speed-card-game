// gameEngine.ts
import type { Card, PlayerState } from '../../stores/game.store'
import { isAdjacent, canPlay } from '../rules/rules'


export type PlayerId = string

export interface GameEngineState {
  centerPiles: [Card, Card]
  players: Record<PlayerId, PlayerState>
  status: 'playing' | 'blocked' | 'finished'
}

export function createGameEngine(initialState: GameEngineState): GameEngineState {
  return JSON.parse(JSON.stringify(initialState)) // simple clone
}

export function tryPlayCard(
  engine: GameEngineState,
  playerId: PlayerId,
  cardId: string,
  pileIndex: 0 | 1
): boolean {

  const player = engine.players[playerId]
  if (!player) return false

  const card = player.revealed.find(c => c.id === cardId)
  const cardIndex = player.revealed.findIndex(c => c.id === cardId)
  if (!card) return false

  const centerCard = engine.centerPiles[pileIndex]
  if (!isAdjacent(card, centerCard)) return false

  // Apply move
  engine.centerPiles[pileIndex] = card
  player.revealed.splice(cardIndex, 1)

  // Reveal next card
  if (player.deck.length > 0) {
    player.revealed.unshift(player.deck.shift()!)
  }

  // blocked game check
  if (isGameBlocked(engine)) {
    engine.status = 'blocked'
    unblockGame(engine)
    engine.status = 'playing'
  }

  // Win condition
  if (player.revealed.length === 0 && player.deck.length === 0) {
    engine.status = 'finished'
    console.log(`Player ${playerId} wins!`)
  }

  return true
}

export function isGameBlocked(engine: GameEngineState): boolean {
  return Object.values(engine.players).every(player =>
    !canPlay(player.revealed, engine.centerPiles)
  )
}

export function unblockGame(engine: GameEngineState): void {

  const drawFromAnyDeck = () => {
    for (const player of Object.values(engine.players)) {
      if (player.deck.length > 0) {
        return player.deck.shift()!
      }
    }
    return null
  }

  const card1 = drawFromAnyDeck()
  const card2 = drawFromAnyDeck()

  if (!card1 || !card2) {
    engine.status = 'finished'
    return
  }

  engine.centerPiles = [card1, card2]
}