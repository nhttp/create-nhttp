<template>
  <form @submit.prevent="submit">
    <input v-model="name" placeholder="Enter your name" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');

const submit = () => {
  alert(`Hello, ${name.value}!`);
};
</script>