<template>
  <div class="border-2 border-gray-800 w-full">
    <h3 class="font-bold italic">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
