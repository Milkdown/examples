<script lang="ts">
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { nord } from '@milkdown/theme-nord'

const markdown =
`# Milkdown Svelte Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Svelte**.`

function editor(dom) {
  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, dom)
      ctx.set(defaultValueCtx, markdown)
    })
    .config(nord)
    .use(commonmark)
    .create();
}
</script>

<main>
  <div use:editor />
</main>
