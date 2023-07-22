<script setup>
import Search from "../components/search/Search.vue";
import MyList from "../components/my-list/MyList.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { ref, provide } from "vue";

const watchlist = ref([]);

const addToWatchlist = (id) => {
  watchlist.value.push(id);
  console.log("id added to watchlist :", id);
  console.log("watchlist", watchlist.value);
};

provide("watchlist", watchlist);
provide("addToWatchlist", addToWatchlist);
console.log("watchlist", watchlist.value);
</script>

<template>
  <div>
    <h1 class="">Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>

    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank"
      >Learn more about Nuxt Routing</a
    >
    <Search />
    <MyList watchlist="watchlist.value" />
  </div>
</template>
