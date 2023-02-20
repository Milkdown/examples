import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import type { FC } from 'react';

import { Milkdown, useEditor } from '@milkdown/react'
import { blockquoteSchema, commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';

import '@milkdown/theme-nord/style.css';
import { useNodeViewFactory, usePluginViewFactory } from '@prosemirror-adapter/react';
import { $prose, $view } from '@milkdown/utils';
import { Blockquote } from './Blockquote';
import { Plugin } from '@milkdown/prose/state';
import { Size } from './Size';

const markdown =
`# Milkdown React Custom Component

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.
The quote is built by a custom react component.`

export const MilkdownEditor: FC = () => {
  const nodeViewFactory = useNodeViewFactory();
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdown)
      })
      .config(nord)
      .use(commonmark)
      .use($view(blockquoteSchema.node, () => nodeViewFactory({ component: Blockquote })))
      .use($prose(() => new Plugin({ view: pluginViewFactory({ component: Size }) })))
  }, [])

  return <Milkdown />
}
