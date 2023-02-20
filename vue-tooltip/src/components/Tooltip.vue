<script setup lang="ts">
import type { Ctx } from '@milkdown/ctx';
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { callCommand } from '@milkdown/utils'
import { TooltipProvider } from "@milkdown/plugin-tooltip"
import { computed, onMounted, onUnmounted, ref, VNodeRef, watch } from 'vue'
import { useInstance } from '@milkdown/vue';
import { toggleStrongCommand } from '@milkdown/preset-commonmark';

const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const action = computed(() => {
  (fn: (ctx: Ctx) => void) => {
    if (loading.value) return;
    get()?.action(fn)
  }
})

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
  <div ref="divRef">
    <button
      className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
      @mousedown="toggleBold"
    >
      Bold
    </button>
  </div>
</template>
