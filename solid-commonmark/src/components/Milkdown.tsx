import { onCleanup, onMount } from 'solid-js';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import '@milkdown/theme-nord/style.css'

const markdown =
`# Milkdown Solid Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Solid**.`

const Milkdown = () => {
  let ref!: HTMLDivElement;
  let editor: Editor;
  onMount(async () => {
    editor = await Editor.make()
      .config((ctx) => {
          ctx.set(rootCtx, ref);
          ctx.set(defaultValueCtx, markdown);
      })
      .config(nord)
      .use(commonmark)
      .create();
  });

  onCleanup(() => {
      editor.destroy()
  });

  return <div ref={ref} />;
};

export default Milkdown
