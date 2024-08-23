import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { html } from '@milkdown/kit/component';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { oneDark } from '@codemirror/theme-one-dark';
import { nord } from '@milkdown/theme-nord';
import { codeBlockComponent, codeBlockConfig } from '@milkdown/kit/component/code-block';
import { languages } from '@codemirror/language-data';
import { basicSetup } from 'codemirror';
import { defaultKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

import '@milkdown/theme-nord/style.css';

import './style.css';

const markdown =
  `# Milkdown Component Code Block

\`\`\`ts
import { Editor } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';

import { nord } from '@milkdown/theme-nord';
import '@milkdown/theme-nord/style.css';

Editor
  .make()
  .config(nord)
  .use(commonmark)
  .create();
\`\`\`

This is a demo for using [Milkdown](https://milkdown.dev) code block component`

const check = html`
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
`

await Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
    ctx.update(codeBlockConfig.key, defaultConfig => ({
      ...defaultConfig,
      languages,
      extensions: [basicSetup, oneDark, keymap.of(defaultKeymap)],
      renderLanguage: (language, selected) => {
        return html`<span class="leading">${selected ? check : null}</span>${language}`
      },
    }))
  })
  .config(nord)
  .use(commonmark)
  .use(codeBlockComponent)
  .create()

