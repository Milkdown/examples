<script setup lang="ts">
import { BlockProvider } from "@milkdown/kit/plugin/block";
import { useInstance } from '@milkdown/vue';
import { onUnmounted, ref, VNodeRef, watch } from 'vue';

const [loading, get] = useInstance()

const divRef = ref<VNodeRef>();

let tooltipProvider: BlockProvider | undefined;

watch([loading], () => {
  const editor = get();
  if (loading.value || !editor || tooltipProvider) return;

  editor.action(ctx => {
    tooltipProvider = new BlockProvider({
      ctx,
      content: divRef.value as any,
    })

    tooltipProvider.update()
  })
})

onUnmounted(() => {
  tooltipProvider?.destroy()
  tooltipProvider = undefined
})

</script>

<template>
  <div ref="divRef" className="w-6 bg-slate-200 rounded hover:bg-slate-300 cursor-grab absolute">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  </div>
</template>
