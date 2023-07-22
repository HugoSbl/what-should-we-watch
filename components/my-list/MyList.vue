<script setup>
import { ref, watchEffect, inject } from "vue";
import GlobalCards from "../reusable/cards/global-card.vue";
import { useFetch } from "nuxt/app";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";

import { defineProps } from "vue";

const watchlist = inject("watchlist");

watchEffect(() => {
  console.log("watchlist from myList: ", watchlist.value);
});
</script>

<template>
  <GlobalCards title="My list">
    <div v-for="(show, index) in watchlist" :key="index">
      <div>Test</div>
    </div>
  </GlobalCards>
</template>
