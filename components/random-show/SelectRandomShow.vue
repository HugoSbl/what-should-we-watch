<template>
  <SectionCard title="What should we watch tonight ?">
    <div class="w-full flex">
      <n-button @click="handleRandomizer">
        Select a random show from selected ones in my list</n-button
      >
    </div>
    <DisplayRandomShowCard :selectedShow="selectedShow" />
  </SectionCard>
</template>

<script setup>
import { ref, inject } from "vue";
import SectionCard from "../reusable/cards/SectionCard.vue";
import DisplayRandomShowCard from "./DisplayRandomShowCard.vue";
import { NButton } from "naive-ui";

const selectedWatchlistShows = inject("selectedWatchlistShows");

let selectedShow = ref(null); // To hold the selected show
let alreadySelectedShows = ref([]); // To hold the shows that have already been selected

const handleRandomizer = () => {
  if (selectedWatchlistShows.value.length > 0) {
    let weightedShows = [];

    selectedWatchlistShows.value.forEach((show) => {
      // Assuming rating is between 0 and 10, you can adjust accordingly
      const count = Math.floor(show.rating);
      console.log("show", show);
      for (let i = 0; i < count; i++) {
        // Create an array with shows repeated as per their ratings
        weightedShows.push(show);
      }
    });

    weightedShows = weightedShows.filter(
      (show) => !alreadySelectedShows.value.includes(show.id)
    );

    if (weightedShows.length > 0) {
      const randomIndex = Math.floor(Math.random() * weightedShows.length);
      selectedShow.value = weightedShows[randomIndex];

      alreadySelectedShows.value.push(selectedShow.value.id);

      console.log("Randomly selected show:", selectedShow.value);
    } else {
      console.log("All shows have been selected"); // rajouter un toast ici
    }
  } else {
    console.log("No shows selected"); // rajouter un toast ici
  }
};
</script>
