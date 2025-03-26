<template>
  <div class="todo-list">
    <div class="todo-input">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="新しいタスクを入力"
      />
      <button @click="addTodo" class="add-btn">追加</button>
    </div>

    <div class="todo-stats" v-if="todos.length > 0">
      <span>完了: {{ completedCount }} / {{ todos.length }}</span>
    </div>

    <div class="todo-actions" v-if="todos.length > 0">
      <button
        @click="deleteCompletedTodos"
        class="delete-completed-btn"
        v-if="hasCompletedTodos"
      >
        完了したタスクを削除 ({{ completedCount }}件)
      </button>
      <button @click="deleteAllTodos" class="delete-all-btn">全て削除</button>
    </div>

    <ul class="todo-items">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <label class="todo-checkbox">
          <input type="checkbox" v-model="todo.completed" />
          <span class="checkmark"></span>
        </label>
        <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)" class="delete-btn">削除</button>
      </li>
    </ul>

    <div class="todo-empty" v-if="todos.length === 0">タスクがありません</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const newTodo = ref('');
const todos = ref<Todo[]>([]);
let nextId = 1;

const hasCompletedTodos = computed(() => {
  return todos.value.some((todo) => todo.completed);
});

const completedCount = computed(() => {
  return todos.value.filter((todo) => todo.completed).length;
});

const addTodo = () => {
  if (!newTodo.value.trim()) return;

  todos.value.push({
    id: nextId++,
    title: newTodo.value,
    completed: false,
  });
  newTodo.value = '';
};

const deleteTodo = (id: number) => {
  todos.value = todos.value.filter((t) => t.id !== id);
};

const deleteAllTodos = () => {
  if (confirm('全てのTODOを削除してもよろしいですか？')) {
    todos.value = [];
    nextId = 1;
  }
};

const deleteCompletedTodos = () => {
  if (confirm('完了したタスクを全て削除してもよろしいですか？')) {
    todos.value = todos.value.filter((todo) => !todo.completed);
  }
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: #888;
}

.todo-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.todo-input {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.todo-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-stats {
  margin-bottom: 10px;
  text-align: right;
  color: #666;
}

.todo-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.add-btn {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.todo-checkbox {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.todo-checkbox:hover input ~ .checkmark {
  border-color: #4caf50;
}

.todo-checkbox input:checked ~ .checkmark {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.todo-checkbox input:checked ~ .checkmark:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.delete-btn {
  margin-left: auto;
  padding: 4px 8px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-all-btn,
.delete-completed-btn {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-all-btn {
  background-color: #ff4444;
}

.delete-completed-btn {
  background-color: #ff8800;
}

.todo-empty {
  text-align: center;
  color: #888;
  margin-top: 20px;
}

button:hover {
  opacity: 0.8;
}
</style>
