<script setup lang="ts">
import { editorViewCtx } from "@milkdown/kit/core";
import { SlashProvider } from "@milkdown/kit/plugin/slash";
import { createCodeBlockCommand } from '@milkdown/kit/preset/commonmark';
import { callCommand } from '@milkdown/kit/utils';
import { useInstance } from '@milkdown/vue';
import { usePluginViewContext } from '@prosemirror-adapter/vue';
import { onMounted, onUnmounted, ref, VNodeRef, watch } from 'vue';

const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref<VNodeRef>();

let tooltipProvider: SlashProvider;

onMounted(() => {
  tooltipProvider = new SlashProvider({
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

const addCodeBlock = (e: Event) => {
  if (loading.value) return;

  e.preventDefault()

  get()!.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { dispatch, state } = view;
      const { tr, selection } = state;
      const { from } = selection;
      dispatch(tr.deleteRange(from - 1, from))
      return callCommand(createCodeBlockCommand.key)(ctx)
  })
}

</script>

<template>
  <div ref="divRef" class="absolute data-[show='false']:hidden">
    <button
      class="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
      @mousedown="addCodeBlock"
    >
      Code Block
    </button>
  </div>
</template>
