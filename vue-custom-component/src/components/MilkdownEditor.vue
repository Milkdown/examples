<script setup lang="ts">
import { Milkdown, useEditor } from '@milkdown/vue';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord'
import { blockquoteSchema, commonmark, headingSchema } from '@milkdown/preset-commonmark'
import { $prose, $view } from '@milkdown/utils';
import Blockquote from './Blockquote.vue';
import { useNodeViewFactory, usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/vue';
import { Plugin } from '@milkdown/prose/state'
import Size from './Size.vue';
import { Decoration, DecorationSet } from '@milkdown/prose/view';
import HeadingAnchor from './HeadingAnchor.vue';

const markdown =
`# Milkdown Vue Custom Component

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.
The quote is built by a custom vue component.`

const nodeViewFactory = useNodeViewFactory();
const pluginViewFactory = usePluginViewFactory();
const widgetViewFactory = useWidgetViewFactory()

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
    })
    .use(commonmark)
    // Add custom node view
    .use($view(blockquoteSchema.node, () => nodeViewFactory({
      component: Blockquote
    })))
    // Add custom plugin view
    .use($prose(() => new Plugin({
      view: pluginViewFactory({
        component: Size
      })
    })))
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
      })
    }))
})
</script>

<template>
  <Milkdown />
</template>
