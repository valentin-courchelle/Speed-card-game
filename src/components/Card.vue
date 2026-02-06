<<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import type { Card as CardType } from '../stores/game.store'

  interface Props {
    card: CardType
    isFlying?: boolean
    startPos?: { x: number; y: number }
    endPos?: { x: number; y: number } | null
  }

  const props = defineProps<Props>()

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
  <div 
    ref="el"
    class="card"
    :class="{ flying: isFlying }"
    :style="styleFlying"
  >
    <div class="rank">{{ card.rank }}</div>
    <div class="suit">{{ card.suit }}</div>
  </div>
</template>

<style scoped>
.card {
  width: 90px;
  height: 130px;
  border-radius: 8px;
  border: 1px solid #333;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  user-select: none;
  color: black
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.rank {
  font-size: 20px;
  font-weight: bold;
}

.suit {
  align-self: flex-end;
  font-size: 14px;
}


.flying {
  z-index: 100;
}
</style>
