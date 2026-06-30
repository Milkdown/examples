<script lang="ts">
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { nord } from '@milkdown/theme-nord'
import type { Attachment } from "svelte/attachments";

const markdown =
`# Milkdown Svelte Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Svelte**.`

  const editor = (content: string): Attachment => {
    return (dom) => {
      const makeEditor = Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, dom);
          ctx.set(defaultValueCtx, content);
        })
        .config(nord)
        .use(commonmark)
        .create();

      return () => {
        makeEditor.then((editor) => {
          editor.destroy();
        });
      };
    };
  };

</script>

<main>
  <div {@attach editor(markdown)} />
</main>
