<template>
  <form @submit.prevent="submit">
    <input v-model="name" placeholder="Enter your name" />
    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  data: () => ({ name: '' }),
  methods: {
    submit() {
      alert(`Hello, ${this.name}!`);
    },
  },
};
</script>