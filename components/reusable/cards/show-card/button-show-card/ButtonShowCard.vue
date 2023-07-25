<template>
  <div class="h-full flex items-center pr-2">
    <div v-if="showCardVersion === 'search'" class="flex items-center">
      <Modal :id="id" />
      <NButton
        v-if="!isInWatchlist"
        class="text-xl"
        strong
        secondary
        type="primary"
        @click="addToWatchlist(id)"
        >Add</NButton
      >
    </div>

    <div v-if="showCardVersion === 'mylist'">
      <div class="flex items-center">
        <NSpace item-style="display: flex;" align="center" class="mr-4">
          <NCheckbox size="large" @update:checked="handleCheckboxChange" />
        </NSpace>
        <Modal :id="id" />
        <NButton
          class="text-xl"
          strong
          secondary
          type="error"
          @click="removeFromWatchlist(id)"
          >Delete</NButton
        >
      </div>
    </div>
    <div v-if="showCardVersion === 'randomizer'"><Modal :id="id" /></div>
  </div>
</template>

<script setup>
import { toRefs, computed, inject } from "vue";
import { NSpace, NCheckbox, NButton } from "naive-ui";
import Modal from "./ModalButtonShowCard.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  rating: {
    type: [Number, Object],
    required: true,
  },
  showCardVersion: {
    type: String,
    required: true,
  },
});

const { id, rating } = toRefs(props);
const watchlist = inject("watchlist");
const addToWatchlist = inject("addToWatchlist");
const removeFromWatchlist = inject("removeFromWatchlist");
const selectedWatchlistShows = inject("selectedWatchlistShows");

const addToSelectedWatchlistShows = (id, rating) => {
  rating = rating.average || 5; // if no rating available, rating is set to 5
  selectedWatchlistShows.value.push({ id: id, rating: rating });
  console.log("selectedWatchlistShows", selectedWatchlistShows.value);
};

const removeFromSelectedWatchlistShows = (id) => {
  const index = selectedWatchlistShows.value.findIndex(
    (show) => show.id === id
  );
  if (index !== -1) {
    selectedWatchlistShows.value.splice(index, 1);
  }
};

const isInWatchlist = computed(() => {
  return watchlist.value.includes(id.value);
});

const handleCheckboxChange = (checked) => {
  console.log("Checkbox change:", {
    checked,
    id: id.value,
    rating: rating.value,
  });
  if (checked) {
    addToSelectedWatchlistShows(id.value, rating.value);
  } else {
    removeFromSelectedWatchlistShows(id.value);
  }
};
</script>
