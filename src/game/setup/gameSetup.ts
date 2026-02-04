import type { GameEngineState } from '../engine/gameEngine'
import { createDeck } from './deck'
import { shuffle } from './shuffle'

export function createInitialGameState(): GameEngineState {
  const deck = shuffle(createDeck())

  const player1Revealed = deck.splice(0, 5)
  const player1Deck = deck.splice(0, 20)

  const player2Revealed = deck.splice(0, 5)
  const player2Deck = deck.splice(0, 20)

  const centerPiles: [any, any] = [
    deck.splice(0, 1)[0],
    deck.splice(0, 1)[0]
  ]

  return {
    centerPiles,
    players: {
      "player1": {
        deck: player1Deck,
        revealed: player1Revealed
      },
      "player2": {
        deck: player2Deck,
        revealed: player2Revealed
      }
    },
    status: 'playing'
  }
}
