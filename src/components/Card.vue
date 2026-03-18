<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import type { Card as CardType } from '../stores/game.store'
  import SuitSymbol from './SuitSymbol.vue'

  interface Props {
    card: CardType
    isFlying?: boolean
    startPos?: { x: number; y: number }
    endPos?: { x: number; y: number } | null
  }

  const props = defineProps<Props>()

  const rankLabel = computed(() => {
    switch (props.card.rank) {
      case 1: return 'A'
      case 11: return 'J'
      case 12: return 'Q'
      case 13: return 'K'
      default: return props.card.rank.toString()
    }
  })

  const isRed = computed(() => {
    return props.card.suit === 'hearts' || props.card.suit === 'diamonds'
  })

  const isFaceCard = computed(() => {
    return props.card.rank === 11
    || props.card.rank === 12
    || props.card.rank === 13
  })

  const isAs = computed(() => {
    return props.card.rank === 1
  })

  type Cell = [number, number]

const pipLayouts: Record<number, Cell[]> = {
  1: [[4,3]],

  2: [
    [2,3],
    [6,3]
  ],

  3: [
    [2,3],
    [4,3],
    [6,3]
  ],

  4: [
    [1,2], [1,4],
    [7,2], [7,4]
  ],

  5: [
    [1,2], [1,4],
    [4,3],
    [7,2], [7,4]
  ],

  6: [
    [1,2], [1,4],
    [4,2], [4,4],
    [7,2], [7,4]
  ],

  7: [
    [1,2], [1,4],
    [3,3],
    [4,2], [4,4],
    [7,2], [7,4]
  ],

  8: [
    [1,2], [1,4],
    [3,2], [3,4],
    [5,2], [5,4],
    [7,2], [7,4]
  ],

  9: [
    [1,2], [1,4],
    [3,2], [3,4],
    [4,3],
    [5,2], [5,4],
    [7,2], [7,4]
  ],

  10: [
    [1,2], [1,4],
    [2,3],
    [3,2], [3,4],
    [5,2], [5,4],
    [6,3],
    [7,2], [7,4]
  ]
}

  const pips = computed(() => {
    return pipLayouts[props.card.rank] ?? []
  })

  const emit = defineEmits<{
    (e: 'animation-end'): void
  }>()

  const el = ref<HTMLElement | null>(null)

  const styleFlying = computed(() => {
    if (!props.isFlying || !props.startPos) return {}

    const dx = props.endPos
      ? props.endPos.x - props.startPos.x
      : 0

    const dy = props.endPos
      ? props.endPos.y - props.startPos.y
      : 0

    return {
      position: 'fixed' as const,
      left: `${props.startPos.x}px`,
      top: `${props.startPos.y}px`,
      transform: `translate(${dx}px, ${dy}px)`,
      transition: props.endPos ? 'transform 0.3s ease' : 'none',
      zIndex: 1000,
      pointerEvents: 'none' as const
    }
  })

  onMounted(() => {
    if (!props.isFlying || !el.value) return

    const handler = (e: TransitionEvent) => {
      if (e.propertyName !== 'transform') return
      emit('animation-end')
    }

    el.value.addEventListener('transitionend', handler)

    // ✅ Fallback sécurité (au cas où transitionend ne part pas)
    const fallback = window.setTimeout(() => {
      emit('animation-end')
    }, 350)

    onBeforeUnmount(() => {
      el.value?.removeEventListener('transitionend', handler)
    })
  })

</script>

<template>
  <div class="card" :class="{ red: isRed }">

    <div class="corner top">
      <span class="rank">{{ rankLabel }}</span>
      <SuitSymbol :suit="card.suit"/>
    </div>

    <div class="center">

      <template v-if="isFaceCard">
        <div class="face">
          {{ rankLabel }}
        </div>
      </template>

      <template v-else>

        <div class="pips-grid">

          <SuitSymbol
            v-for="(cell, i) in pips"
            :key="i"
            :suit="card.suit"
            class="pip"
            :style="{
              gridRow: cell[0],
              gridColumn: cell[1]
            }"
            :class="{ flipped: cell[0] > 4 , as: isAs}"
          />

        </div>

      </template>

    </div>

    <div class="corner bottom">
      <span class="rank">{{ rankLabel }}</span>
      <SuitSymbol :suit="card.suit"/>
    </div>

  </div>
</template>

<style scoped>
.card {
  width: 96px;
  height: 140px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px;
  cursor: pointer;
  user-select: none;
  color: black;
  /* font-family: "Georgia", serif; */
  position: relative;
}

.card.red {
  color: #d12c2c;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.corner {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 16px;
  font-size: 16px;
}

.corner.bottom {
  transform: rotate(180deg);
}

.center{
  width: 100%;
  overflow: hidden;
}


.rank {
  /* font-size: 20px; */
  font-weight: bold;
}

.pips-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(7, 1fr);

  width: 100%;
  height: 100%;

  justify-items: center;
  align-items: center;
}

.pip {
  width: 70%;
  aspect-ratio: 1;
}

.face{
  font-weight: bold;
}

.as{
  transform: scale(1.5);
}

.flipped {
  transform: rotate(180deg);
}

.flying {
  z-index: 100;
}
</style>
