import { createHighlighter, Highlighter } from "shiki";
import { $proseAsync } from "@milkdown/kit/utils";
import { Node } from "@milkdown/kit/prose/model";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";
import { findChildren } from "@milkdown/kit/prose";
import { codeBlockSchema } from "@milkdown/kit/preset/commonmark";
import type { Ctx } from "@milkdown/kit/ctx";

function getHighlighter() {
  return createHighlighter({
    themes: ["github-light"],
    langs: ["javascript", "tsx", "typescript", "markdown"],
  });
}

function getDecorations(ctx: Ctx, doc: Node, highlighter: Highlighter) {
  const decorations: Decoration[] = [];

  const children = findChildren(
    (node) => node.type === codeBlockSchema.type(ctx)
  )(doc);

  children.forEach(async (block) => {
    let from = block.pos + 1;
    const pos = block.pos;
    const size = block.node.nodeSize;
    const { language } = block.node.attrs;
    if (!language) return;
    const { tokens, rootStyle } = highlighter.codeToTokens(block.node.textContent, {
      lang: language,
      theme: highlighter.getLoadedThemes()[0]!,
    })


    if (rootStyle) {
      const decoration = Decoration.node(pos, pos + size, { style: rootStyle })
      decorations.push(decoration)
    }

    for (const line of tokens) {
      for (const token of line) {
        const to = from + token.content.length

        const decoration = Decoration.inline(from, to, {
          // When using `options.themes` the `htmlStyle` field will be set, otherwise `color` will be set
          style: stringifyTokenStyle(
            token.htmlStyle ?? `color: ${token.color}`,
          ),
          class: 'shiki',
        })

        decorations.push(decoration)

        from = to
      }

      from += 1
    }
  });

  return DecorationSet.create(doc, decorations);
}

function stringifyTokenStyle(token: string | Record<string, string>): string {
  if (typeof token === 'string') return token
  return Object.entries(token)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}

export const milkShiki = $proseAsync(async (ctx) => {
  const key = new PluginKey("shiki");
  const highlighter = await getHighlighter();

  return new Plugin({
    key,
    state: {
      init: (_, { doc }) => getDecorations(ctx, doc, highlighter),
      apply: (tr, value, oldState, newState) => {
        const codeBlockType = codeBlockSchema.type(ctx);
        const isNodeName =
          newState.selection.$head.parent.type === codeBlockType;
        const isPreviousNodeName =
          oldState.selection.$head.parent.type === codeBlockType;
        const oldNode = findChildren((node) => node.type === codeBlockType)(
          oldState.doc
        );
        const newNode = findChildren((node) => node.type === codeBlockType)(
          newState.doc
        );

        const codeBlockChanged =
          tr.docChanged &&
          (isNodeName ||
            isPreviousNodeName ||
            oldNode.length !== newNode.length ||
            oldNode[0]?.node.attrs.language !==
              newNode[0]?.node.attrs.language);

        if (codeBlockChanged) {
          return getDecorations(ctx, tr.doc, highlighter);
        }

        return value.map(tr.mapping, tr.doc);
      },
    },
    props: {
      decorations(state) {
        return key.getState(state);
      },
    },
  });
});
