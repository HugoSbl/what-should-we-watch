<script setup>
import { ref, watchEffect, inject, onMounted } from "vue";
import SectionCard from "../reusable/cards/SectionCard.vue";
import { useFetch } from "nuxt/app";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";

const watchlistIds = inject("watchlist");
const showsInWatchlist = ref([]);

onMounted(() => {
  watchEffect(async () => {
    const uniqueIds = Array.from(new Set(watchlistIds.value));
    const newShowsInWatchlist = [];

    for (const id of uniqueIds) {
      const show = showsInWatchlist.value.find((show) => show.id === id);

      if (show) {
        newShowsInWatchlist.push(show);
      } else {
        const { data, error, execute } = useFetch(
          `https://api.tvmaze.com/shows/${id}`
        );

        await execute();

        if (error.value) {
          console.log("error", error.value);
          return;
        }

        newShowsInWatchlist.push(data.value);
      }
    }

    showsInWatchlist.value = newShowsInWatchlist;
  });
});
</script>

<template>
  <SectionCard title="My list">
    <div class="overflow-y-auto h-96">
      <div v-for="show in showsInWatchlist" :key="show.id">
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
  </SectionCard>
</template>
