<script setup lang="ts">
import { useNodeViewContext } from '@prosemirror-adapter/vue'
const { contentRef } = useNodeViewContext()
</script>

<template>
  <blockquote :ref="contentRef" class="bg-amber-50 p-0.5 rounded !border !border-slate-200" />
</template>
