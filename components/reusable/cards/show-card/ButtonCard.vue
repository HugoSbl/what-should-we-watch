<template>
  <div class="h-full flex items-center pr-2">
    <div v-if="showCardVersion === 'search'">
      <button
        class="py-1 px-2 rounded bg-yellow-300"
        @click="addToWatchlist(id)"
      >
        Add to watchlist
      </button>
    </div>

    <div v-if="showCardVersion === 'mylist'">
      <div class="flex">
        <n-space item-style="display: flex;" align="center" class="mr-2">
          <n-checkbox size="large" @change="handleCheckboxChange" />
        </n-space>
        <button
          class="py-1 px-2 rounded bg-yellow-300"
          @click="removeFromWatchlist(id)"
        >
          remove from list
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, toRefs } from "vue";
import { NSpace, NCheckbox } from "naive-ui";

export default {
  components: { NSpace, NCheckbox },
  props: {
    id: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    showCardVersion: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { id, rating } = toRefs(props);
    const addToWatchlist = inject("addToWatchlist");
    const removeFromWatchlist = inject("removeFromWatchlist");
    const selectedWatchlistShows = inject("selectedWatchlistShows");

    const addToSelectedWatchlistShows = (id, rating) => {
      selectedWatchlistShows.value.push({ id, rating });
      console.log("selectedWatchlistShows", selectedWatchlistShows.value);
    };

    const removeFromSelectedWatchlistShows = (id) => {
      const index = selectedWatchlistShows.value.findIndex(
        (show) => show.id === id
      );
      if (index !== -1) {
        selectedWatchlistShows.value.splice(index, 1);
        console.log("selectedWatchlistShows", selectedWatchlistShows.value);
      }
    };

    const handleCheckboxChange = (checked) => {
      if (checked) {
        addToSelectedWatchlistShows(id.value, rating.value);
      } else {
        removeFromSelectedWatchlistShows(id.value);
      }
    };

    return {
      addToWatchlist,
      removeFromWatchlist,
      selectedWatchlistShows,
      addToSelectedWatchlistShows,
      removeFromSelectedWatchlistShows,
      handleCheckboxChange,
    };
  },
};
</script>
