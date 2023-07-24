<script setup>
import Search from "../components/search/Search.vue";
import MyList from "../components/my-list/MyList.vue";
import SelectRandomShow from "../components/random-show/SelectRandomShow.vue";
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
      <Search class="md:w-[50%]" />
      <MyList class="md:w-[50%]" :watchlist="watchlist.value" />
    </div>

    <SelectRandomShow />
  </div>
</template>
