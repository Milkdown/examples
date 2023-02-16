<script setup lang="ts">
import { MilkdownProvider } from '@milkdown/vue';
import MilkdownEditor from './components/MilkdownEditor.vue';
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
</template>
