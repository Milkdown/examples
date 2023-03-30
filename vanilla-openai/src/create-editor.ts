import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { copilotPlugin } from "./copilotPlugin";

const markdown = `
# Milkdown Vanilla OpenAI

## Hotel California

On a dark desert **highway**, cool wind in my hair.
`;


export const createEditor = async (root: string) => {
  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, document.querySelector(root));
      ctx.set(defaultValueCtx, markdown);
    })
    .config(nord)
    .use(commonmark)
    .use(copilotPlugin)
    .create();

  return editor;
};
