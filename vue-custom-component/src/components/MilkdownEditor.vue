<script setup lang="ts">
import { Milkdown, useEditor } from '@milkdown/vue';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord'
import { blockquoteSchema, commonmark } from '@milkdown/preset-commonmark'
import { $prose, $view } from '@milkdown/utils';
import Blockquote from './Blockquote.vue';
import { useNodeViewFactory, usePluginViewFactory } from '@prosemirror-adapter/vue';
import { Plugin } from '@milkdown/prose/state'
import Size from './Size.vue';

const markdown =
`# Milkdown Vue Custom Component

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.
The quote is built by a custom vue component.`

const nodeViewFactory = useNodeViewFactory();
const pluginViewFactory = usePluginViewFactory();

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
    })
    .use(commonmark)
    .use($view(blockquoteSchema.node, () => nodeViewFactory({ component: Blockquote })))
    .use($prose(() => new Plugin({ view: pluginViewFactory({ component: Size }) })))
})
</script>

<template>
  <Milkdown />
</template>
