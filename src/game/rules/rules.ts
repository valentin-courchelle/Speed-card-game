import type {Card} from '../../stores/game.store'

export function isAdjacent(cardA: Card, cardB: Card): boolean {

    if(cardA.rank === 1 && cardB.rank === 13) return true;
    if(cardA.rank === 13 && cardB.rank === 1) return true;

    return Math.abs(cardA.rank - cardB.rank) === 1;
}

export function canPlay(
  revealed: Card[],
  centerPiles: [Card, Card]
): boolean {

  for (const card of revealed) {
    if (
      isAdjacent(card, centerPiles[0]) ||
      isAdjacent(card, centerPiles[1])
    ) {
      return true
    }
  }

  return false
}

