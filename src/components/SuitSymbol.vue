<script setup lang="ts">
import hearts from '../assets/hearts.svg'
import diamonds from '../assets/diamonds.svg'
import clubs from '../assets/clubs.svg'
import spades from '../assets/spades.svg'

const props = defineProps<{
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
}>()

const suitSrc = {
  hearts,
  diamonds,
  clubs,
  spades
}
</script>

<template>
  <img
    class="suit"
    :src="suitSrc[suit]"
    :alt="suit"
  />
</template>

<style scoped>
.suit {
  width: auto;
  height: 100%;
}
</style>