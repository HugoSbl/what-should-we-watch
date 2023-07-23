<script setup>
import Search from "../components/search/Search.vue";
import MyList from "../components/my-list/MyList.vue";
import SelectRandomShow from "../components/random-show/SelectRandomShow.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { ref, provide } from "vue";

const watchlist = ref([]);
const selectedWatchlistShows = ref([]);

const addToWatchlist = (id) => {
  watchlist.value.push(id);
};

const removeFromWatchlist = (id) => {
  console.log("watchlist :", watchlist.value);
  const index = watchlist.value.findIndex((showId) => showId === id);
  if (index !== -1) {
    watchlist.value.splice(index, 1);
  }
  const selectedIndex = selectedWatchlistShows.value.findIndex(
    (show) => show.id === id
  );
  if (selectedIndex !== -1) {
    selectedWatchlistShows.value.splice(selectedIndex, 1);
  }
};

provide("watchlist", watchlist);
provide("addToWatchlist", addToWatchlist);
provide("removeFromWatchlist", removeFromWatchlist);
provide("selectedWatchlistShows", selectedWatchlistShows);
</script>

<template>
  <div>
    <h1 class="">Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>

    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank"
      >Learn more about Nuxt Routing</a
    >
    <Search />
    <MyList :watchlist="watchlist.value" />
    <SelectRandomShow />
  </div>
</template>
