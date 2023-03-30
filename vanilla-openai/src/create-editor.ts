import {defaultValueCtx, Editor, editorViewCtx, parserCtx, rootCtx, serializerCtx} from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { $prose } from "@milkdown/utils";
import { Plugin, PluginKey } from "@milkdown/prose/state";
import { DecorationSet, Decoration } from '@milkdown/prose/view';
import { DOMParser, DOMSerializer } from '@milkdown/prose/model'
import {Ctx} from "@milkdown/ctx";

const markdown = `
# Milkdown Vanilla OpenAI

## Hotel California

On a dark desert **highway**. Cool wind in my hair.
`;

async function fetchAIHint(prompt: string) {
    const data: Record<string, string> = { prompt }
    const response = await fetch('/api', {
        method: "POST",
        body: JSON.stringify(data)
    });
    const res = await response.json() as { hint: string };
    return res.hint;
}

const openAIKey = new PluginKey("MilkdownOpenAI")

function getHint(ctx: Ctx) {
  const view = ctx.get(editorViewCtx);
  const { state } = view;
  const tr = state.tr;
  const { from } = tr.selection;
  const slice = tr.doc.slice(0, from)
  const serializer = ctx.get(serializerCtx);
  const doc = view.state.schema.topNodeType.createAndFill(undefined, slice.content);
  if (!doc) return;
  const markdown = serializer(doc);
  fetchAIHint(markdown).then((hint) => {
    const tr = view.state.tr;
    view.dispatch(tr.setMeta(openAIKey, hint))
  })
}

export const createEditor = async (root: string) => {
  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, document.querySelector(root));
      ctx.set(defaultValueCtx, markdown);
    })
    .config(nord)
    .use(commonmark)
    .use($prose((ctx) => {
      return new Plugin({
        key: openAIKey,
        props: {
          handleKeyDown(view, event) {
            const { state } = view;
            const tr = state.tr;
            if (event.key === "Tab") {
              event.preventDefault();
              const { message } = openAIKey.getState(state);
              const parser = ctx.get(parserCtx);
              const slice = parser(message);
              const dom = DOMSerializer.fromSchema(state.schema).serializeFragment(slice.content);
              const domParser = DOMParser.fromSchema(state.schema)
              view.dispatch(tr.setMeta(openAIKey, '').replaceSelection(domParser.parseSlice(dom)));
              return;
            }
            if (event.key === 'Enter' || event.code === 'Space') {
              getHint(ctx)
              return;
            }
            view.dispatch(tr.setMeta(openAIKey, ''))
          },
          decorations(state) {
            return openAIKey.getState(state).deco;
          }
        },
        state: {
          init() {
            return {
              deco: DecorationSet.empty,
              message: '',
            };
          },
          apply(tr, value, _prevState, state) {
            const message = tr.getMeta(openAIKey);
            if (typeof message !== 'string') return value;
            if (message.length === 0) {
              return {
                deco: DecorationSet.empty,
                message: ''
              };
            }
            const { to } = tr.selection;
            const widget = Decoration.widget(to + 1, () => {
              const dom = document.createElement('pre');
              dom.className = "hint"
              dom.innerHTML = message;
              return dom;
            })
            return {
              deco: DecorationSet.create(state.doc, [widget]),
              message,
            };
          }
        }
      })
    }))
    .create();

  return editor;
};
