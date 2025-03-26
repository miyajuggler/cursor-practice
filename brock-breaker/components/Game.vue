<template>
  <div class="game-container">
    <canvas ref="gameCanvas" @click="handleClick"></canvas>
    <div class="score">スコア: {{ score }}</div>
    <div v-if="gameOver" class="game-over">
      ゲームオーバー
      <button @click="restartGame">再スタート</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const gameCanvas = ref(null);
const score = ref(0);
const gameOver = ref(false);
let ctx = null;
let blocks = [];
let ball = {
  x: 0,
  y: 0,
  dx: 5,
  dy: -5,
  radius: 10,
};
let paddle = {
  x: 0,
  y: 0,
  width: 100,
  height: 20,
};

const initGame = () => {
  const canvas = gameCanvas.value;
  canvas.width = 800;
  canvas.height = 600;
  ctx = canvas.getContext('2d');

  // ブロックの初期化
  blocks = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 8; j++) {
      blocks.push({
        x: j * 100 + 50,
        y: i * 30 + 50,
        width: 80,
        height: 20,
        color: `hsl(${i * 30}, 70%, 50%)`,
      });
    }
  }

  // パドルの初期位置
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 40;

  // ボールの初期位置
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;

  score.value = 0;
  gameOver.value = false;
};

const handleClick = (event) => {
  if (gameOver.value) return;

  const rect = gameCanvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // パドルの移動
  paddle.x = x - paddle.width / 2;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > gameCanvas.value.width) {
    paddle.x = gameCanvas.value.width - paddle.width;
  }
};

const update = () => {
  if (gameOver.value) return;

  // ボールの移動
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 壁との衝突判定
  if (
    ball.x + ball.radius > gameCanvas.value.width ||
    ball.x - ball.radius < 0
  ) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // パドルとの衝突判定
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy = -Math.abs(ball.dy);
  }

  // ブロックとの衝突判定
  blocks.forEach((block, index) => {
    if (
      ball.x + ball.radius > block.x &&
      ball.x - ball.radius < block.x + block.width &&
      ball.y + ball.radius > block.y &&
      ball.y - ball.radius < block.y + block.height
    ) {
      ball.dy = -ball.dy;
      blocks.splice(index, 1);
      score.value += 10;
    }
  });

  // ゲームオーバー判定
  if (ball.y + ball.radius > gameCanvas.value.height) {
    gameOver.value = true;
  }

  // クリア判定
  if (blocks.length === 0) {
    gameOver.value = true;
  }
};

const draw = () => {
  if (gameOver.value) return;

  // キャンバスのクリア
  ctx.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);

  // ブロックの描画
  blocks.forEach((block) => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });

  // パドルの描画
  ctx.fillStyle = '#333';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // ボールの描画
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();
};

const gameLoop = () => {
  update();
  draw();
  requestAnimationFrame(gameLoop);
};

const restartGame = () => {
  initGame();
};

onMounted(() => {
  initGame();
  gameLoop();
});
</script>

<style scoped>
.game-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

canvas {
  border: 2px solid #333;
  background: #f0f0f0;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>
