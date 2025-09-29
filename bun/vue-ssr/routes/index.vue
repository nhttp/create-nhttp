<template>
  <layout>
    <h1>Hello, Vue SSR!</h1>
    <counter />
    <user_form />
  </layout>
</template>

<script setup>
import Layout from "../components/layout.vue";
import Counter from "../components/counter.vue";
import UserForm from "../components/user_form.vue";
</script>