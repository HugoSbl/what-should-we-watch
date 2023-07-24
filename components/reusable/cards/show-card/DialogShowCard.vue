<script setup>
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
</script>

<template>
  <DialogRoot>
    <DialogTrigger> Test </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      C'est ouf ca
      <DialogContent>
        <DialogTitle>This is it</DialogTitle>
        <DialogDescription />
        <DialogClose />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
