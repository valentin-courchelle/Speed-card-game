import { decideMove } from './ai'
import { tryPlayCard } from '../engine/gameEngine'
import type { GameEngineState } from '../engine/gameEngine'

export function startAIScheduler(
  engine: GameEngineState,
  playerId: string,
  reactionTimeMs: number
) : number {
  return setInterval(() => {

    if (engine.status !== 'playing') return

    const aiPlayer = engine.players[playerId]
    if (!aiPlayer) return

    const decision = decideMove(
      aiPlayer.revealed,
      engine.centerPiles
    )

    if (!decision) return

    tryPlayCard(
      engine,
      playerId,
      decision.cardId,
      decision.pileIndex
    )
  }, reactionTimeMs)
}
