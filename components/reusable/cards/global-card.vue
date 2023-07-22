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

<template>
  <div class="border-2 p-2 border-gray-800 m-4">
    <h3 class="font-bold italic">{{ title }}</h3>
    <slot></slot>
  </div>
</template>
