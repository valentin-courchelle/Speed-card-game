import type { Card } from '../../stores/game.store'

const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const

export function createDeck(): Card[] {
  const deck: Card[] = []

  for (const suit of suits) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${rank}_${suit}`,
        rank,
        suit
      })
    }
  }

  return deck
}
