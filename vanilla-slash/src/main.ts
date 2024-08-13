import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { slash, slashPluginView } from './Slash';

declare global {
  var __milkdown__: Editor
}

import '@milkdown/theme-nord/style.css';

import './style.css';

const markdown =
`# Milkdown Vanilla Slash

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vanilla Typescript**.

Type \`/\` to see the slash command.`

Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
    ctx.set(slash.key, {
      view: slashPluginView
    })
  })
  .config(nord)
  .use(commonmark)
  .use(slash)
  .create()
  .then(editor => {
    globalThis.__milkdown__ = editor
  })
