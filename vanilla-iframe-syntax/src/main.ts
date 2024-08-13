import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { $inputRule, $node, $remark } from '@milkdown/kit/utils';
import { Node } from '@milkdown/kit/prose/model';
import { InputRule } from '@milkdown/kit/prose/inputrules';
import directive from 'remark-directive';

import '@milkdown/theme-nord/style.css';
import './style.css';

const markdown =
`# Milkdown Vanilla Iframe Syntax

::iframe{src="https://saul-mirone.github.io"}

This is a demo for using Milkdown with custom syntax: \`iframe\`.

You can use the following syntax to insert an iframe:
\`\`\`
::iframe{src="https://mirone.me"}
\`\`\`
`

const remarkDirective = $remark('remarkDirective', () => directive)
const directiveNode = $node('iframe', () => ({
  group: 'block',
  atom: true,
  isolating: true,
  marks: '',
  attrs: {
    src: { default: null },
  },
  parseDOM: [{
    tag: 'iframe',
    getAttrs: (dom) => ({
      src: (dom as HTMLElement).getAttribute('src'),
    }),
  }],
  toDOM: (node: Node) => ['iframe', {...node.attrs, 'contenteditable': false}, 0],
  parseMarkdown: {
    match: (node) => node.type === 'leafDirective' && node.name === 'iframe',
    runner: (state, node, type) => {
      state.addNode(type, { src: (node.attributes as { src: string }).src });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'iframe',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'iframe',
        attributes: { src: node.attrs.src },
      });
    },
  }
}))

const inputRule = $inputRule((ctx) => new InputRule(/::iframe\{src\="(?<src>[^"]+)?"?\}/, (state, match, start, end) => {
  const [okay, src = ''] = match;
  const { tr } = state;
  if (okay) {
    tr.replaceWith(start - 1, end, directiveNode.type(ctx).create({ src }));
  }

  return tr;
}))

Editor
  .make()
  .config(ctx => {
    ctx.set(rootCtx, '#app')
    ctx.set(defaultValueCtx, markdown)
  })
  .config(nord)
  .use(commonmark)
  .use([...remarkDirective, directiveNode, inputRule])
  .create()
