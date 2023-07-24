<script setup>
import SearchSection from "../components/searchSection/SearchSection.vue";
import MyListSection from "../components/my-list-section/MyListSection.vue";
import SelectRandomShowSection from "../components/random-show-section/RandomShowSection.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { ref, provide, onMounted, watch } from "vue";

const watchlist = ref([]);
const selectedWatchlistShows = ref([]);

onMounted(() => {
  const storedWatchlist = localStorage.getItem("watchlist");
  if (storedWatchlist) {
    watchlist.value = JSON.parse(storedWatchlist);
  }
});

watch(watchlist, (newWatchlist) => {
  console.log("localStorage :", newWatchlist);
  localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
});

const addToWatchlist = (id) => {
  watchlist.value = [...watchlist.value, id];
};

const removeFromWatchlist = (id) => {
  const newWatchlist = watchlist.value.filter((showId) => showId !== id);
  watchlist.value = newWatchlist;

  const selectedIndex = selectedWatchlistShows.value.findIndex(
    (show) => show.id === id
  );
  if (selectedIndex !== -1) {
    const newSelectedWatchlistShows = selectedWatchlistShows.value.filter(
      (show) => show.id !== id
    );
    selectedWatchlistShows.value = newSelectedWatchlistShows;
  }
};

provide("watchlist", watchlist);
provide("addToWatchlist", addToWatchlist);
provide("removeFromWatchlist", removeFromWatchlist);
provide("selectedWatchlistShows", selectedWatchlistShows);
</script>

<template>
  <div>
    <div class="md:flex w-full">
      <SearchSection class="md:w-[50%]" />
      <MyListSection class="md:w-[50%]" :watchlist="watchlist.value" />
    </div>

    <SelectRandomShowSection />
  </div>
</template>
