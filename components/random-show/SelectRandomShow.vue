<template>
  <SectionCard title="What should we watch tonight ?">
    <div class="w-full flex">
      <n-button @click="handleRandomizer">
        Select a random show from selected ones in my list
      </n-button>
      <DisplayRandomShowCard
        v-if="!isPending"
        :selectedShowData="selectedShow"
        :isPending="isPending"
      />
    </div>
  </SectionCard>
</template>

<script setup>
import { ref, inject } from "vue";
import { useFetch } from "nuxt/app";
import SectionCard from "../reusable/cards/SectionCard.vue";
import DisplayRandomShowCard from "./DisplayRandomShowCard.vue";
import { NButton } from "naive-ui";

const selectedWatchlistShows = inject("selectedWatchlistShows");
const isPending = ref(true);

let selectedShow = ref(null);
let alreadySelectedShows = ref([]);

const handleRandomizer = async () => {
  if (selectedWatchlistShows.value.length > 0) {
    let weightedShows = [];

    selectedWatchlistShows.value.forEach((show) => {
      const count = Math.floor(show.rating);
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
      const { data, error, pending } = await useFetch(
        `https://api.tvmaze.com/shows/${selectedShow.value.id}`
      );
      if (error.value) {
        console.log("error", error.value);
        return;
      }
      isPending.value = pending.value;
      selectedShow.value = data.value;

      console.log("selected show : ", selectedShow.value);
      isPending.value = pending.value;
      console.log("isPending : ", isPending.value);
    } else {
      console.log("All shows have been selected"); // add a toast here
    }
  } else {
    console.log("No shows selected"); // add a toast here
  }
};
</script>
