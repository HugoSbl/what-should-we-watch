<script>
import { defineProps } from "vue";
import ShowCard from "../reusable/cards/show-card/ShowCard.vue";

const props = defineProps({
  selectedShowData: { type: Object, required: true },
});
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ShowCard,
  },
});
</script>

<template>
  <div>
    <ShowCard
      v-if="selectedShowData"
      :id="selectedShowData.id"
      :title="selectedShowData.name"
      :image="selectedShowData.image"
      :premiered="selectedShowData.premiered"
      :ended="selectedShowData.ended"
      :rating="selectedShowData.rating"
      :averageRuntime="selectedShowData.averageRuntime"
      showCardVersion="randomizer"
    />
    <div>
      {{ selectedShowData.name }}
    </div>
  </div>
</template>
