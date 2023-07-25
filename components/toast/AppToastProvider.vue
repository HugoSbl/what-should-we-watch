<!-- app-toast-provider.vue -->
<template>
  <ToastProvider>
    <ToastPlacements v-slot="{ placements }">
      <ToastGroup
        v-for="(placement, placementIdx) in placements"
        :key="placementIdx"
        v-slot="{ toasts }"
        :placement="placement"
      >
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          class="bg-slate-800/90 border-2 border-white/10 px-4 py-2 rounded-lg m-4 text-base"
        >
          <ToastTitle class="font-bold my-2" />
          <ToastDescription class="mb-2" />
        </Toast>
      </ToastGroup>
    </ToastPlacements>
    <slot></slot>
  </ToastProvider>
</template>

<script setup>
import {
  ToastPlacements,
  ToastGroup,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
} from "@ark-ui/vue";
</script>
