<script setup>
import { ref, watchEffect } from "vue";
import GlobalCards from "../reusable/cards/global-card.vue";
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
    console.log("fetch result", fetchResults.value);
    return;
  }
});
</script>

<template>
  <GlobalCards title="Search">
    <div class="flex flex-col">
      <input
        class="w-full border-2"
        v-model="searchInput"
        placeholder="search for a show"
      />
      <div>this is a test</div>
      <div v-if="fetchResults && fetchResults.length > 0 && !isFetching">
        <div v-for="(show, index) in fetchResults" :key="index">
          <ShowCard
            :title="show.show.name"
            :image="show.show.image"
            :premiered="show.show.premiered"
            :ended="show.show.ended"
            :rating="show.show.rating"
            :averageRuntime="show.show.averageRuntime"
          />
        </div>
      </div>
    </div>
  </GlobalCards>
</template>
