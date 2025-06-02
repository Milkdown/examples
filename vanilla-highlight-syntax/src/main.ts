import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";

import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { $remark } from "@milkdown/kit/utils";
import { remarkMarkColor } from "./remark-mark-color";

import "@milkdown/theme-nord/style.css";
import "./style.css";
import { markSchema } from "./mark-schema";
import { markInputRule } from "./inputrule";
import { colorPickerTooltip, colorPickerTooltipConfig } from "./color-picker";
import { history } from "@milkdown/kit/plugin/history";
import { codeToHtml } from "shiki";

const markdown = `# Milkdown Vanilla Highlight Syntax

You can use the following syntax to insert an highlighted text:
\`\`\`
==highlighted text==

=={#EE4B2B}highlighted text with color==
\`\`\`

This is a paragraph contains some ==highlighted text==.

This is a =={#EE4B2B}red text==.
`;

const milkdownMarkColorPlugin = $remark("markColor", () => remarkMarkColor);

Editor.make()
  .config((ctx) => {
    ctx.set(rootCtx, "#app");
    ctx.set(defaultValueCtx, markdown);

    ctx
      .get(listenerCtx)
      .markdownUpdated((_, markdown) => {
        injectMarkdown(markdown);
      })
      .mounted(() => {
        injectMarkdown(markdown);
      });
  })
  .config(nord)
  .config(colorPickerTooltipConfig)
  .use(history)
  .use(colorPickerTooltip)
  .use(commonmark)
  .use(milkdownMarkColorPlugin)
  .use(listener)
  .use(markSchema)
  .use(markInputRule)
  .create();

const markdownContainer = document.getElementById("markdown")!;
let running = false;
export function injectMarkdown(markdown: string) {
  if (running) return;
  running = true;
  codeToHtml(markdown, {
    lang: "markdown",
    theme: "vitesse-light",
  })
    .then((html) => {
      markdownContainer.innerHTML = html;
    })
    .finally(() => {
      running = false;
    })
    .catch(console.error);
}
