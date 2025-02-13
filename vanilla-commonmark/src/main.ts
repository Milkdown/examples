import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";

import "@milkdown/theme-nord/style.css";

const markdown = `# Milkdown Vanilla Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vanilla Typescript**.`;

Editor.make()
  .config((ctx) => {
    ctx.set(rootCtx, "#app");
    ctx.set(defaultValueCtx, markdown);
  })
  .config(nord)
  .use(commonmark)
  .create();
