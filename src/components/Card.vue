<<script setup lang="ts">
import type { Card } from '../stores/game.store'

defineProps<{
  card: Card
}>()
</script>

<template>
  <div class="card">
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
</style>
