import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import type { FC } from 'react';

import { commonmark } from '@milkdown/kit/preset/commonmark';
import { Milkdown, useEditor } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import { block } from '@milkdown/kit/plugin/block';
import { cursor } from '@milkdown/kit/plugin/cursor';

import { BlockView } from './Block';

import '@milkdown/theme-nord/style.css';

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
