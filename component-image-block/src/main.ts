import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { imageBlockComponent } from '@milkdown/kit/component/image-block'

import '@milkdown/theme-nord/style.css';

import './style.css';

const markdown =
  `# Milkdown Component Image Block

![1.0](/sample.jpg "Sample (This is an editable caption)")

![]()

This is a demo for using [Milkdown](https://milkdown.dev) image block component`

await Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
  })
  .config(nord)
  .use(commonmark)
  .use(imageBlockComponent)
  .create()

