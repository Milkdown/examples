<script setup lang="ts">
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { tooltipFactory } from '@milkdown/plugin-tooltip';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/vue';
import { usePluginViewFactory } from '@prosemirror-adapter/vue';
import Tooltip from './Tooltip.vue';

const tooltip = tooltipFactory('Text');

const markdown =
`# Milkdown Vue Tooltip

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.
Select some texts to see the tooltip.`

const pluginViewFactory = usePluginViewFactory();

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
      ctx.set(tooltip.key, {
        view: pluginViewFactory({
          component: Tooltip
        }),
      })
    })
    .use(commonmark)
    .use(tooltip)
})
</script>

<template>
  <Milkdown />
</template>
