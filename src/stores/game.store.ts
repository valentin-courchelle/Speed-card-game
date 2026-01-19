import { defineStore } from 'pinia'
import { isAdjacent } from '../game/rules'


export interface Card {
  rank: number
  suit: string
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

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    centerPiles: [
      { rank: 1, suit: 'hearts' },
      { rank: 13, suit: 'spades' }
    ],
    players: {'player1': {
      deck: [],
      revealed: [{ rank: 2, suit: 'hearts' }, { rank: 3, suit: 'hearts' }, { rank: 4, suit: 'hearts' }]
    }},
    status: 'playing'
  }),

  actions: {
    playCard(playerId: string, cardIndex: number, pileIndex: 0 | 1) : boolean {

      const player = this.players[playerId];
      if(!player) return false;

      const card = player.revealed[cardIndex];
      if(!card) return false;

      const centerCard = this.centerPiles[pileIndex];
      
      if(!isAdjacent(card, centerCard)) {
        console.log('Card is not adjacent to center pile');
        return false;
      }

      //Apply move
      this.centerPiles[pileIndex] = card;
      player.revealed.splice(cardIndex, 1);

      // Reveal next card
      if(player.deck.length > 0) {
        player.revealed.unshift(player.deck.shift()!);
      }

      // Win condition
      if(player.revealed.length === 0 && player.deck.length === 0) {
        this.status = 'finished';
        console.log(`Player ${playerId} wins!`);
      }
      return true;
    }
  }
})
