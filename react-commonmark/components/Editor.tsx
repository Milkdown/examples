import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import type { FC } from 'react';

import { Milkdown, useEditor } from '@milkdown/react'
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';

import '@milkdown/theme-nord/style.css';

const markdown =
`# Milkdown React Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.`

export const MilkdownEditor: FC = () => {
  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdown)
      })
      .config(nord)
      .use(commonmark)
  }, [])

  return <Milkdown />
}
