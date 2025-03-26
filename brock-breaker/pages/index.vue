<template>
  <div class="container">
    <h1>ブロック崩しゲーム</h1>
    <Game />
  </div>
</template>

<script setup>
import Game from '~/components/Game.vue';
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}
</style>
