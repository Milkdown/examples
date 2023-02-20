import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import type { FC } from 'react';

import { Milkdown, useEditor } from '@milkdown/react'
import { blockquoteSchema, commonmark, headingSchema } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';

import '@milkdown/theme-nord/style.css';
import { useNodeViewFactory, usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/react';
import { $prose, $view } from '@milkdown/utils';
import { Blockquote } from './Blockquote';
import { Plugin } from '@milkdown/prose/state';
import { Size } from './Size';
import { Decoration, DecorationSet } from '@milkdown/prose/view';
import { HeadingAnchor } from './HeadingAnchor';

const markdown =
`# Milkdown React Custom Component

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.
The quote is built by a custom react component.`

export const MilkdownEditor: FC = () => {
  const nodeViewFactory = useNodeViewFactory();
  const pluginViewFactory = usePluginViewFactory();
  const widgetViewFactory = useWidgetViewFactory()

  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdown)
      })
      .config(nord)
      .use(commonmark)
      // Add a custom node view
      .use($view(blockquoteSchema.node, () => nodeViewFactory({
        component: Blockquote
      })))
      // Add a custom plugin view
      .use($prose(() => new Plugin({
        view: pluginViewFactory({ component: Size })
      })))
      // Add a custom widget view
      .use($prose(() => {
        const getAnchorWidget = widgetViewFactory({
          as: 'span',
          component: HeadingAnchor
        })
        return new Plugin({
          props: {
            decorations: (state) => {

              const widgets: Decoration[] = []

              state.doc.descendants((node, pos) => {
                if (node.type === headingSchema.type()) {
                  widgets.push(getAnchorWidget(pos + 1, {
                    id: node.attrs.id,
                    level: node.attrs.level,
                    side: -1,
                  }))
                }
              })

              return DecorationSet.create(state.doc, widgets);
            }
          }
        });
      }))
  }, [])

  return <Milkdown />
}
