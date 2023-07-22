<template>
  <div class="h-full flex items-center pr-2">
    <div v-if="showCardVersion === 'search'">
      <button
        @click="addToWatchlist(id)"
        class="py-1 px-2 rounded bg-yellow-300"
      >
        Add to watchlist
      </button>
    </div>

    <div v-if="showCardVersion === 'mylist'">
      <div class="flex">
        <n-space item-style="display: flex;" align="center" class="mr-2">
          <n-checkbox size="large" />
        </n-space>
        <button
          @click="removeFromWatchlist(id)"
          class="py-1 px-2 rounded bg-yellow-300"
        >
          remove from list
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
import { NSpace, NCheckbox } from "naive-ui";

export default {
  setup() {
    const addToWatchlist = inject("addToWatchlist");
    const removeFromWatchlist = inject("removeFromWatchlist");
    console.log("removeFromWatchList :", removeFromWatchlist);
    return { addToWatchlist, removeFromWatchlist };
  },
  components: { NSpace, NCheckbox },
  props: {
    id: {
      type: Number,
      required: true,
    },
    showCardVersion: {
      type: String,
      required: true,
    },
  },
};
</script>
