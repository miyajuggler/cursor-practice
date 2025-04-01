<template>
  <div class="chat-container">
    <v-container class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="selectedModel"
            :items="
              Object.entries(MODEL_NAMES).map(([key, value]) => ({
                title: `${value.display} (${value.modelName})`,
                value: key,
              }))
            "
            label="AIモデルを選択"
            variant="outlined"
            class="mb-4"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <div class="messages-wrapper">
      <v-card class="messages pa-4" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role]"
        >
          <v-card
            :class="[
              'message-content',
              message.role === 'user' ? 'bg-primary' : 'bg-grey-lighten-3',
            ]"
            :color="message.role === 'user' ? 'primary' : 'grey-lighten-3'"
            class="pa-4"
          >
            <div :class="message.role === 'user' ? 'text-white' : 'text-black'">
              {{ message.content }}
            </div>
          </v-card>
        </div>
      </v-card>
    </div>

    <v-container class="input-area pa-0">
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="userInput"
            @keyup.enter="sendMessage"
            label="メッセージを入力..."
            :disabled="isLoading"
            variant="outlined"
            rows="3"
            auto-grow
            hide-details
            class="mb-2"
          ></v-textarea>
          <v-btn
            @click="sendMessage"
            :loading="isLoading"
            :disabled="isLoading"
            color="primary"
            block
          >
            {{ isLoading ? '送信中...' : '送信' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.messages-wrapper {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.messages {
  height: 100%;
  overflow-y: auto;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message-content {
  border-radius: 8px;
}

.input-area {
  background: white;
  padding: 16px 0;
}
</style>
