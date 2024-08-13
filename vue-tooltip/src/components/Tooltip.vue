<script setup lang="ts">
import { TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { toggleStrongCommand } from '@milkdown/kit/preset/commonmark';
import { callCommand } from '@milkdown/kit/utils';
import { useInstance } from '@milkdown/vue';
import { usePluginViewContext } from '@prosemirror-adapter/vue';
import { onMounted, onUnmounted, ref, VNodeRef, watch } from 'vue';

const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref<VNodeRef>();

let tooltipProvider: TooltipProvider;

onMounted(() => {
  tooltipProvider = new TooltipProvider({
    content: divRef.value as any,
  })

  tooltipProvider.update(view.value, prevState.value)
})

watch(
  [view, prevState],
  () => {
    tooltipProvider?.update(view.value, prevState.value)
  }
)

onUnmounted(() => {
  tooltipProvider.destroy()
})

const toggleBold = (e: Event) => {
  if (loading.value) return;

  e.preventDefault()

  get()!.action(callCommand(toggleStrongCommand.key))
}

</script>

<template>
  <div class="absolute data-[show=false]:hidden" ref="divRef">
    <button
      class="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
      @mousedown="toggleBold"
    >
      Bold
    </button>
  </div>
</template>
