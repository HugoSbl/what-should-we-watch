<template>
  <ShowCard />
</template>

<script>
import { defineProps, toRef } from "vue";
import ShowCard from "../../components/reusable/cards/show-card/ShowCard.vue";

const props = defineProps({
  selectedShow: { type: Object, required: true },
});

const selectedShow = toRef(props, "selectedShow");
</script>
