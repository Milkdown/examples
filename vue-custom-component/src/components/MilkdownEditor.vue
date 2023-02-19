<script setup lang="ts">
import { Milkdown, useEditor } from '@milkdown/vue';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord'
import { blockquoteSchema, commonmark } from '@milkdown/preset-commonmark'
import { $view } from '@milkdown/utils';
import Blockquote from './Blockquote.vue';
import { useNodeViewFactory } from '@prosemirror-adapter/vue';

const markdown =
`# Milkdown Vue Custom Component

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.
The quote is built by a custom vue component.`

const nodeViewFactory = useNodeViewFactory();

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
    })
    .use(commonmark)
    .use($view(blockquoteSchema.node, () => nodeViewFactory({ component: Blockquote })))
})
</script>

<template>
  <Milkdown />
</template>
