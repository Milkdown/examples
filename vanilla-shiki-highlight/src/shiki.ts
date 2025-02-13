import { getHighlighter, Highlighter } from "shiki";
import { $proseAsync } from "@milkdown/kit/utils";
import { Node } from "@milkdown/kit/prose/model";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";
import { findChildren } from "@milkdown/kit/prose";
import { codeBlockSchema } from "@milkdown/kit/preset/commonmark";
import type { Ctx } from "@milkdown/kit/ctx";

function getDecorations(ctx: Ctx, doc: Node, highlighter: Highlighter) {
  const decorations: Decoration[] = [];

  const children = findChildren(
    (node) => node.type === codeBlockSchema.type(ctx)
  )(doc);

  children.forEach(async (block) => {
    let from = block.pos + 1;
    const { language } = block.node.attrs;
    if (!language) return;
    const nodes = highlighter
      .codeToThemedTokens(block.node.textContent, language)
      .map((token) =>
        token.map(({ content, color }) => ({
          content,
          color,
        }))
      );
    nodes.forEach((block) => {
      block.forEach((node) => {
        const to = from + node.content.length;
        const decoration = Decoration.inline(from, to, {
          style: `color: ${node.color}`,
        });
        decorations.push(decoration);
        from = to;
      });
      from += 1;
    });
  });

  return DecorationSet.create(doc, decorations);
}

export const milkShiki = $proseAsync(async (ctx) => {
  const highlighter = await getHighlighter({
    theme: "github-light",
    langs: ["javascript", "tsx", "markdown"],
  });
  const key = new PluginKey("shiki");

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
