<template>
  <div>
    <n-button @click="showModal = true"> Trigger </n-button>
    <n-modal
      v-model:visible="showModal"
      class="custom-card"
      preset="card"
      :style="bodyStyle"
      title="Modal"
      :bordered="false"
      size="huge"
      :segmented="segmented"
    >
      <template #header-extra> Oops! </template>
      Content
      <template #footer> Footer </template>
    </n-modal>
  </div>
</template>

<script>
import { NButton, NModal } from "naive-ui";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    return {
      bodyStyle: {
        width: "600px",
      },
      segmented: {
        content: "soft",
        footer: "soft",
      },
      showModal: ref(false),
    };
  },
});
</script>
