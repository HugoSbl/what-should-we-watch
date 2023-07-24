<template>
  <div class="h-full flex items-center pr-2">
    <div v-if="showCardVersion === 'search'">
      <button
        v-if="!isInWatchlist"
        class="py-1 px-2 rounded bg-yellow-300"
        @click="addToWatchlist(id)"
      >
        Add to watchlist
      </button>
    </div>

    <div v-if="showCardVersion === 'mylist'">
      <div class="flex">
        <NSpace item-style="display: flex;" align="center" class="mr-2">
          <NCheckbox size="large" @change="handleCheckboxChange" />
        </NSpace>
        <button
          class="py-1 px-2 rounded bg-yellow-300"
          @click="removeFromWatchlist(id)"
        >
          remove from list
        </button>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import { inject, toRefs, computed } from "vue";
import { NSpace, NCheckbox } from "naive-ui";

export default {
  components: { NSpace, NCheckbox },
  props: {
    id: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number || Object,
      required: true,
    },
    showCardVersion: {
      type: String,
      required: true,
    },
  },
  setup(props) {
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

    return {
      addToWatchlist,
      removeFromWatchlist,
      selectedWatchlistShows,
      isInWatchlist,
      addToSelectedWatchlistShows,
      removeFromSelectedWatchlistShows,
      handleCheckboxChange,
    };
  },
};
</script>
