<script setup lang="ts">
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { slashFactory } from '@milkdown/plugin-slash';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/vue';
import { usePluginViewFactory } from '@prosemirror-adapter/vue';
import Slash from './Slash.vue';

const tooltip = slashFactory('Commands');

const markdown =
`# Milkdown Vue Slash

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.

Type \`/\` to see the slash command.`

const pluginViewFactory = usePluginViewFactory();

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
      ctx.set(tooltip.key, {
        view: pluginViewFactory({
          component: Slash
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
