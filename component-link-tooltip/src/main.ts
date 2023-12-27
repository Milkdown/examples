import {defaultValueCtx, Editor, editorViewCtx, rootCtx} from '@milkdown/core';
import {commonmark, linkSchema} from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import {
  configureLinkTooltip,
  linkTooltipPlugin,
  linkTooltipAPI,
  linkTooltipState
} from '@milkdown/components/link-tooltip';

import '@milkdown/theme-nord/style.css';

import './style.css';
import {Ctx} from "@milkdown/ctx";

const markdown =
  `# Milkdown Component Link Tooltip

> You're scared of a world where you're needed.

This is a demo for using [Milkdown](https://milkdown.dev) link tooltip component`

const insertLink = (ctx: Ctx) => {
  const view = ctx.get(editorViewCtx)
  const { selection, doc } = view.state

  if (selection.empty)
    return

  // already in edit mode
  if (ctx.get(linkTooltipState.key).mode === 'edit')
    return

  const has = doc.rangeHasMark(selection.from, selection.to, linkSchema.type(ctx))
  // range already has link
  if (has)
    return

  ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.to)
}

const insertLinkButton = document.createElement('button')
insertLinkButton.className = 'insert-link-button'
insertLinkButton.textContent = '🔗'
document.body.prepend(insertLinkButton)

const editor = await Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
    configureLinkTooltip(ctx)
  })
  .config(nord)
  .use(commonmark)
  .use(linkTooltipPlugin)
  .create()

insertLinkButton.onclick = () => {
  editor.action(insertLink)
}
