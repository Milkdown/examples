<script setup lang="ts">
import Milkdown from './components/MilkdownEditor.vue'
import { MilkdownProvider } from '@milkdown/vue';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue';
</script>

<template>
  <MilkdownProvider>
    <ProsemirrorAdapterProvider>
      <Milkdown />
    </ProsemirrorAdapterProvider>
  </MilkdownProvider>
</template>
