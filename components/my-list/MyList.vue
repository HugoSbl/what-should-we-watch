<script setup>
import { ref, watchEffect, inject, onMounted } from "vue";
import GlobalCards from "../reusable/cards/global-card.vue";
import { useFetch } from "nuxt/app";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";

const watchlistId = inject("watchlist");
const shows = ref({});

onMounted(() => {
  watchEffect(async () => {
    // Create a new array from the set of ids, which removes duplicates
    const uniqueIds = Array.from(new Set(watchlistId.value));

    for (const id of uniqueIds) {
      // If the show for this id has already been fetched, skip to the next id
      if (shows.value[id]) {
        continue;
      }

      const { data, error, execute } = useFetch(
        `https://api.tvmaze.com/shows/${id}`
      );

      await execute();

      if (error.value) {
        console.log("error", error.value);
        return;
      }

      shows.value[id] = data.value;
      console.log("shows", shows.value);
    }

    for (const id in shows.value) {
      if (!uniqueIds.includes(Number(id))) {
        delete shows.value[id];
      }
    }
  });
});
</script>

<template>
  <GlobalCards title="My list">
    <div class="overflow-y-auto h-96">
      <div v-for="(show, index) in shows" :key="index">
        <ShowCard
          :id="show.id"
          :title="show.name"
          :image="show.image"
          :premiered="show.premiered"
          :ended="show.ended"
          :rating="show.rating"
          :averageRuntime="show.averageRuntime"
          showCardVersion="mylist"
        />
      </div>
    </div>
  </GlobalCards>
</template>
