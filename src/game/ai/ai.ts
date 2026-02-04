import type { Card } from '../../stores/game.store'
import { isAdjacent } from '../rules/rules'

export interface AIDecision {
  cardId: string
  pileIndex: 0 | 1
}

export function decideMove(
  hand: Card[],
  centerPiles: [Card, Card]
): AIDecision | null {

  const possibleMoves: AIDecision[] = []
  const pileIndexes = [0, 1] as const

  for (const card of hand) {
    for (const pileIndex of pileIndexes) {
      const pileCard = centerPiles[pileIndex]

      if (isAdjacent(card, pileCard)) {
        possibleMoves.push({ cardId: card.id, pileIndex })
      }
    }
  }

  if (possibleMoves.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * possibleMoves.length)
  return possibleMoves[randomIndex] ?? null
}
