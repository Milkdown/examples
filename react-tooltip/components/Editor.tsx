import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import type { FC } from 'react';

import { commonmark } from '@milkdown/kit/preset/commonmark';
import { Milkdown, useEditor } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import { usePluginViewFactory } from '@prosemirror-adapter/react';

import { tooltip, TooltipView } from './Tooltip';

import '@milkdown/theme-nord/style.css';

const markdown =
`# Milkdown React Tooltip

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.
Select some texts to see the tooltip.`

export const MilkdownEditor: FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdown)
        ctx.set(tooltip.key, {
          view: pluginViewFactory({
            component: TooltipView,
          })
        })
      })
      .config(nord)
      .use(commonmark)
      .use(tooltip)
  }, [])

  return <Milkdown />
}
