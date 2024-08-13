<script setup lang="ts">
import { Milkdown, useEditor } from '@milkdown/vue';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { nord } from '@milkdown/theme-nord'
import { commonmark } from '@milkdown/kit/preset/commonmark'

const markdown =
`# Milkdown Nuxt Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Nuxt**.`

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
    })
    .use(commonmark)
})
</script>

<template>
  <Milkdown />
</template>
