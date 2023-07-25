<template>
  <Body
    class="max-w-screen text-white bg-slate-900 w-full flex flex-col justify-center"
  >
    <AppToastProvider
      ><NuxtPage class="max-w-screen-2xl mx-auto"
    /></AppToastProvider>
  </Body>
</template>
<script setup>
import AppToastProvider from "./components/toast/AppToastProvider.vue";
</script>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
</style>
