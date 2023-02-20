<script setup lang="ts">
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { block } from '@milkdown/plugin-block';
import { cursor } from '@milkdown/plugin-cursor';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/vue';
import { usePluginViewFactory } from '@prosemirror-adapter/vue';
import Block from './Block.vue';

const markdown =
`# Milkdown Vue Block

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.

Hover the cursor on the editor to see the block handle.`

const pluginViewFactory = usePluginViewFactory();

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
      ctx.set(block.key, {
        view: pluginViewFactory({
          component: Block
        }),
      })
    })
    .use(commonmark)
    .use(block)
    .use(cursor)
})
</script>

<template>
  <Milkdown />
</template>
