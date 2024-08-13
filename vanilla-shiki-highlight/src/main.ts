import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';

import '@milkdown/theme-nord/style.css';
import { milkShiki } from './shiki';

import './style.css';

const markdown =
`# Milkdown Vanilla Shiki Highlight

> You're scared of a world where you're needed.

\`\`\`ts
Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
  })
  .config(nord)
  .use(commonmark)
  .use(milkShiki)
  .create()
\`\`\`

This is a demo for using Milkdown with **Vanilla Typescript**.
The code block is highlighted by [shiki](https://shiki.matsu.io/).`

Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
  })
  .config(nord)
  .use(milkShiki)
  .use(commonmark)
  .create()
