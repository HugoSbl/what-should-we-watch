<script setup>
import { ref, watchEffect } from "vue";
import SectionCard from "../reusable/cards/SectionCard.vue";
import { useFetch } from "nuxt/app";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";

const searchInput = ref("");
let fetchResults = ref([]);

watchEffect(async () => {
  if (searchInput.value.length > 3) {
    const { data, error, isFetching } = await useFetch(
      `https://api.tvmaze.com/search/shows?q=${searchInput.value}`
    );
    if (error.value) {
      console.log("error", error.value);
      return;
    }
    if (isFetching) {
      console.log("fetching data...");
      return;
    }
    fetchResults.value = data.value;
    return;
  }
});
</script>

<template>
  <SectionCard title="Search">
    <div class="flex flex-col">
      <input
        v-model="searchInput"
        class="w-full rounded text-white border-white/10 p-2 bg-white/10 mb-2"
        placeholder="search for a show"
      />

      <div class="overflow-y-auto h-96">
        <div v-for="(show, index) in fetchResults" :key="index">
          <ShowCard
            :id="show.show.id"
            :title="show.show.name"
            :image="show.show.image"
            :premiered="show.show.premiered"
            :ended="show.show.ended"
            :rating="show.show.rating"
            :averageRuntime="show.show.averageRuntime"
            showCardVersion="search"
          />
        </div>
      </div>
    </div>
  </SectionCard>
</template>
