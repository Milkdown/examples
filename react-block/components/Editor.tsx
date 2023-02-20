import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import type { FC } from 'react';

import { commonmark } from '@milkdown/preset-commonmark';
import { Milkdown, useEditor } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import { usePluginViewFactory } from '@prosemirror-adapter/react';

import { BlockView } from './Block';

import '@milkdown/theme-nord/style.css';
import { block } from '@milkdown/plugin-block';
import { cursor } from '@milkdown/plugin-cursor';

const markdown =
`# Milkdown React Block

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

Hover the cursor on the editor to see the block handle.`

export const MilkdownEditor: FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdown)
        ctx.set(block.key, {
          view: pluginViewFactory({
          component: BlockView,
          })
        })
      })
      .config(nord)
      .use(commonmark)
      .use(block)
      .use(cursor)
  }, [])

  return <Milkdown />
}
