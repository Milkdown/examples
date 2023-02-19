<script setup lang="ts">
import Milkdown from './components/MilkdownEditor.vue'
import { MilkdownProvider } from '@milkdown/vue';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue';
</script>

<template>
  <ProsemirrorAdapterProvider>
    <MilkdownProvider>
      <Milkdown />
    </MilkdownProvider>
  </ProsemirrorAdapterProvider>
</template>
