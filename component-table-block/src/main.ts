import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { nord } from '@milkdown/theme-nord';
import { tableBlock } from '@milkdown/kit/component/table-block'

import '@milkdown/theme-nord/style.css';

import './style.css';

const markdown =
  `# Milkdown Component Table Block

| Fruit | Animal | Vegetable |
| ----- | :----: | --------: |
| Apple | Cat    | Carrot    |
| Banana| Dog    | Cabbage   |
| Cherry| Horse  | Celery    |

This is a demo for using [Milkdown](https://milkdown.dev) table block component`

await Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
  })
  .config(nord)
  .use(commonmark)
  .use(gfm)
  .use(tableBlock)
  .create()

