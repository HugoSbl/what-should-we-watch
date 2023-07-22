<template>
  <div class="flex h-36 mb-2">
    <img
      v-if="image && image.medium"
      :src="image.medium"
      alt="Show image"
      class="rounded-lg w-24"
    />
    <div v-else class="w-24">No image</div>

    <div>
      <div class="ml-2 font-black">{{ title }}</div>
      <div class="flex">
        <div class="ml-2 rounded bg-slate-400 inline-block text-white p-1">
          <div v-if="rating && rating.average">{{ rating.average }}</div>
          <div v-else>no rating</div>
        </div>
        <div class="ml-2 rounded bg-slate-400 inline-block text-white p-1">
          <div v-if="averageRuntime">{{ averageRuntime }} min</div>
          <div v-else>unknown runtime</div>
        </div>
      </div>

      <div v-if="premiered" class="flex">
        <div class="ml-2">
          <div v-if="premiered">{{ premiered.slice(0, 4) }}</div>
        </div>
        <div>-</div>
        <div class="">
          <div v-if="ended">{{ ended.slice(0, 4) }}</div>
          <div v-else>ongoing</div>
        </div>
      </div>
      <div v-else class="ml-2">unknown date</div>
    </div>
    <div class="left">
      <button class="ml-auto rounded bg-yellow-300">Add to watchlist</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    links: {
      type: String,
      required: false,
    },
    premiered: {
      type: String,
      required: false,
    },
    ended: {
      type: String,
      required: false,
    },
    rating: {
      type: Object,
      required: false,
    },
    averageRuntime: {
      type: Number,
      required: false,
    },
  },
};
</script>
