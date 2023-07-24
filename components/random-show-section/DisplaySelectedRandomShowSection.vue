<script setup>
import { defineProps } from "vue";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";

const props = defineProps({
  selectedShowData: { type: Object, required: false },
});
</script>

<template>
  <div class="flex flex-col">
    <div class="md:border-2 p-2 border-white/20 rounded-lg">
      <ShowCard
        v-if="selectedShowData"
        :id="selectedShowData.id"
        :title="selectedShowData.name"
        :image="selectedShowData.image"
        :premiered="selectedShowData.premiered"
        :ended="selectedShowData.ended"
        :rating="selectedShowData.rating"
        :averageRuntime="selectedShowData.averageRuntime"
        :summary="selectedShowData.summary"
        showCardVersion="randomizer"
      />
      <div class="" v-html="selectedShowData.summary"></div>
    </div>
  </div>
</template>
