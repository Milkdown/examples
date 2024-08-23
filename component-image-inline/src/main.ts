import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { imageInlineComponent } from '@milkdown/kit/component/image-inline'

import '@milkdown/theme-nord/style.css';

import './style.css';

const markdown =
  `# Milkdown Component Image Inline

Crepe provides three themes: Crepe ![crepe](/crepe.png), Nord ![](/nord.png) and Script ![](/script.png).

Maybe more? ![]()

This is a demo for using [Milkdown](https://milkdown.dev) image inline component`

await Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
  })
  .config(nord)
  .use(commonmark)
  .use(imageInlineComponent)
  .create()

