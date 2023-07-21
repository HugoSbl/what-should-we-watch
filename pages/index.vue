<script setup lang="ts">
import Search from "../components/search/Search.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <div>
    <h1 class="">Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>

    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank"
      >Learn more about Nuxt Routing</a
    >
    <Search />
  </div>
</template>
