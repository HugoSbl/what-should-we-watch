<script setup>
import { ref, watchEffect } from "vue";
import GlobalCards from "../reusable/cards/global-card.vue";
import { useFetch } from "nuxt/app";

const searchInput = ref("");
let fetchResults = ref(null);

watchEffect(async () => {
  if (searchInput.value.length > 3) {
    fetchResults.value = await useFetch(
      `https://api.tvmaze.com/search/shows?q=${searchInput.value}`
    );
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
        placeholder="search for a show"
        v-model="searchInput"
      />
      <div>this is a test</div>
    </div>
  </GlobalCards>
</template>
