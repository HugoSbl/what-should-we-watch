<template>
  <SectionCard title="What should we watch tonight ?">
    <div class="w-full flex">
      <n-button @click="handleRandomizer">
        Select a random show from selected ones in my list</n-button
      >
    </div>
  </SectionCard>
</template>

<script setup>
import { inject } from "vue";
import SectionCard from "../reusable/cards/SectionCard.vue";
import { NButton } from "naive-ui";

const selectedWatchlistShows = inject("selectedWatchlistShows");

const handleRandomizer = () => {
  if (selectedWatchlistShows.value.length > 0) {
    const weightedShows = [];

    selectedWatchlistShows.value.forEach((show) => {
      // Assuming rating is between 0 and 10, you can adjust accordingly
      const count = Math.floor(show.rating);
      console.log("show", show);
      for (let i = 0; i < count; i++) {
        // Create an array with shows repeated as per their ratings
        weightedShows.push(show);
      }
    });
    console.log("weightedShows", weightedShows);
    const randomIndex = Math.floor(Math.random() * weightedShows.length);
    console.log("randomIndex", randomIndex);
    const selectedShow = weightedShows[randomIndex];

    console.log("Randomly selected show:", selectedShow);
  } else {
    console.log("No shows selected");
  }
};
</script>
