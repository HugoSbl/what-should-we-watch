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
  <div class="p-2 rounded-xl bg-white/10 border-2 border-white/10 m-4">
    <h3 class="font-bold italic text-xl m-2 text-center">{{ title }}</h3>
    <slot></slot>
  </div>
</template>
