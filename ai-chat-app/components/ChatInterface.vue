<template>
  <div class="chat-container">
    <div class="model-selector">
      <select v-model="selectedModel">
        <option v-for="(model, key) in MODEL_NAMES" :key="key" :value="key">
          {{ model.display }} ({{ model.modelName }})
        </option>
      </select>
    </div>

    <div class="messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>

    <div class="input-area">
      <textarea
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="メッセージを入力..."
        :disabled="isLoading"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '送信中...' : '送信' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MODEL_NAMES = {
  openai: {
    display: 'GPT-4',
    modelName: 'gpt-4o-2024-08-06',
  },
  claude: {
    display: 'Claude 3.5 Sonnet',
    modelName: 'claude-3-5-sonnet-20241022',
  },
  gemini: {
    display: 'Gemini 2.5 Pro',
    modelName: 'gemini-2.5-pro-exp-03-25',
  },
} as const;

const selectedModel = ref('openai');
const userInput = ref('');
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMessage = userInput.value.trim();
  messages.value.push({ role: 'user', content: userMessage });
  userInput.value = '';
  await scrollToBottom();

  isLoading.value = true;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        model: selectedModel.value,
      }),
    });

    const data = await response.json();
    messages.value.push({ role: 'assistant', content: data.response });
  } catch (error) {
    console.error('Error:', error);
    messages.value.push({
      role: 'assistant',
      content: 'エラーが発生しました。もう一度お試しください。',
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.model-selector {
  margin-bottom: 20px;
}

.model-selector select {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message-content {
  padding: 12px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: #007aff;
  color: white;
}

.input-area {
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  height: 60px;
  font-family: inherit;
}

button {
  padding: 12px 24px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
