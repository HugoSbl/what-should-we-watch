<template>
  <div class="flex h-36 mb-2 justify-between hover:bg-black/20">
    <div class="flex items-center">
      <div class="flex-shrink-0 w-24">
        <img
          v-if="image"
          :src="image.medium"
          class="rounded-lg aspect-auto"
          :alt="title"
        />
        <div v-else class="">No image</div>
      </div>

      <div class="md:ml-4 ml-2 space-y-2">
        <div class="font-black text-sm md:text-base line-clamp-1">
          {{ title }}
        </div>
        <div class="inline-flex md:flex-row flex-col md:space-x-1 space-y-1">
          <div
            class="rounded text-sm bg-slate-400/70 inline-block text-white px-1"
          >
            <div v-if="rating && rating.average" class="flex items-center">
              {{ rating.average }}<Star class="ml-1" :size="14" />
            </div>
            <div v-else>no rating</div>
          </div>
          <div
            class="rounded text-sm bg-slate-400/70 inline-block text-white px-1"
          >
            <div v-if="averageRuntime">{{ averageRuntime }} min</div>
            <div v-else>unknown runtime</div>
          </div>
        </div>

        <div v-if="premiered" class="flex">
          <div class="">
            <div v-if="premiered">{{ premiered.slice(0, 4) }}</div>
          </div>
          <div>-</div>
          <div class="">
            <div v-if="ended">{{ ended.slice(0, 4) }}</div>
            <div v-else>ongoing</div>
          </div>
        </div>
        <div v-else class="">unknown date</div>
        <dialog-show-card />
      </div>
    </div>
    <ButtonCard :id="id" :rating="rating" :showCardVersion="showCardVersion" />
  </div>
</template>

<script>
import ButtonCard from "./ButtonCard.vue";
import { watchEffect } from "vue";
import DialogShowCard from "./DialogShowCard.vue";
import { Star } from "lucide-vue-next";

export default {
  components: { ButtonCard, DialogShowCard, Star },

  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
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
      type: Number || Object,
      required: false,
    },
    averageRuntime: {
      type: Number,
      required: false,
    },
    showCardVersion: {
      type: String,
      required: true,
    },
  },
};
</script>
