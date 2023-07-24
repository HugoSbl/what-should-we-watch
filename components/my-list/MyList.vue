<script setup>
import { ref, watchEffect, inject, onMounted, computed } from "vue";
import SectionCard from "../reusable/cards/SectionCard.vue";
import { useFetch } from "nuxt/app";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";
import { NSelect } from "naive-ui";

const watchlistIds = inject("watchlist");
const showsInWatchlist = ref([]);

const sortOptions = [
  { value: "name", label: "Alphabetical Order" },
  { value: "rating", label: "Rating" },
  { value: "year", label: "Year" },
  { value: "isEnded", label: "Ended yet", disabled: true },
];

const selectedSort = ref(sortOptions[0].value);

const runtimeOptions = [
  { value: "all", label: "All runtimes" },
  { value: "short", label: "Short (< 25min)" },
  { value: "medium", label: "Medium (25-50min)" },
  { value: "long", label: "Long (> 50min)" },
];

const selectedRuntime = ref(runtimeOptions[0].value);

const sortedShowsInWatchlist = computed(() => {
  return [...showsInWatchlist.value].sort((a, b) => {
    if (selectedSort.value === "year") {
      return new Date(a.premiered) - new Date(b.premiered);
    } else if (selectedSort.value === "rating") {
      return b.rating.average - a.rating.average;
    } else {
      // Alphabetical order
      return a.name.localeCompare(b.name);
    }
  });
});

const filteredAndSortedShowsInWatchlist = computed(() => {
  return sortedShowsInWatchlist.value.filter((show) => {
    if (!show.averageRuntime) {
      return selectedRuntime.value === "all";
    }
    if (selectedRuntime.value === "short") {
      return show.averageRuntime < 25;
    } else if (selectedRuntime.value === "medium") {
      return show.averageRuntime >= 25 && show.averageRuntime <= 50;
    } else if (selectedRuntime.value === "long") {
      return show.averageRuntime > 50;
    } else {
      return true;
    }
  });
});

// handle watchlist changes and display shows in watchlist
onMounted(() => {
  watchEffect(async () => {
    const uniqueIds = Array.from(new Set(watchlistIds.value));
    const newShowsInWatchlist = [];

    for (const id of uniqueIds) {
      const show = showsInWatchlist.value.find((show) => show.id === id);

      if (show) {
        newShowsInWatchlist.push(show);
      } else {
        const { data, error } = await useFetch(
          `https://api.tvmaze.com/shows/${id}`
        );

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
    <div class="flex">
      <ClientOnly>
        <n-select
          v-model:value="selectedSort"
          size="tiny"
          :options="sortOptions"
          placeholder="Sort by"
        />
        <n-select
          v-model:value="selectedRuntime"
          size="tiny"
          :options="runtimeOptions"
          placeholder="Runtime"
        />
      </ClientOnly>
    </div>
    <div class="overflow-y-auto max-h-[400px]">
      <div v-if="showsInWatchlist.length > 0">
        <div v-for="show in filteredAndSortedShowsInWatchlist" :key="show.id">
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
        <div
          v-if="filteredAndSortedShowsInWatchlist.length === 0"
          class="text-center"
        >
          No shows found for the selected runtime.
        </div>
      </div>
      <div v-else class="text-center">
        Your watchlist is empty. Start adding some shows!
      </div>
    </div>
  </SectionCard>
</template>
