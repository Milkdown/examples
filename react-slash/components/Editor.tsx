import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import type { FC } from 'react';

import { commonmark } from '@milkdown/preset-commonmark';
import { Milkdown, useEditor } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import { usePluginViewFactory } from '@prosemirror-adapter/react';

import { slash, SlashView } from './Slash';

import '@milkdown/theme-nord/style.css';

const markdown =
`# Milkdown React Slash

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

Type \`/\` to see the slash command.`

export const MilkdownEditor: FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdown)
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          })
        })
      })
      .config(nord)
      .use(commonmark)
      .use(slash)
  }, [])

  return <Milkdown />
}
