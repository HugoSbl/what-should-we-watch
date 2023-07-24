<script>
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "radix-vue";

export default {
  components: {
    DialogRoot,
    DialogTrigger,
    DialogContent,
    DialogOverlay,
    DialogClose,
    DialogPortal,
    DialogTitle,
    DialogDescription,
  },
};
</script>

<template>
  <DialogRoot>
    <DialogTrigger> Test </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>This is it</DialogTitle>
        <DialogDescription />
        <DialogClose />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style></style>
