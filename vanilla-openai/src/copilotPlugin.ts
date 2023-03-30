import {Plugin, PluginKey} from "@milkdown/prose/state";
import {Ctx} from "@milkdown/ctx";
import {editorViewCtx, parserCtx, serializerCtx} from "@milkdown/core";
import {$prose} from "@milkdown/utils";
import {DOMParser, DOMSerializer} from "@milkdown/prose/model";
import {Decoration, DecorationSet} from "@milkdown/prose/view";

async function fetchAIHint(prompt: string) {
  const data: Record<string, string> = { prompt }
  const response = await fetch('/api', {
    method: "POST",
    body: JSON.stringify(data)
  });
  const res = await response.json() as { hint: string };
  return res.hint;
}

const copilotKey = new PluginKey("MilkdownCopilot")

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
    view.dispatch(tr.setMeta(copilotKey, hint))
  })
}

function applyHint(ctx: Ctx) {
  const view = ctx.get(editorViewCtx);
  const { state } = view;
  const tr = state.tr;
  const { message } = copilotKey.getState(state);
  const parser = ctx.get(parserCtx);
  const slice = parser(message);
  const dom = DOMSerializer.fromSchema(state.schema).serializeFragment(slice.content);
  const domParser = DOMParser.fromSchema(state.schema)
  view.dispatch(tr.setMeta(copilotKey, '').replaceSelection(domParser.parseSlice(dom)));
}

function hideHint(ctx: Ctx) {
  const view = ctx.get(editorViewCtx);
  const { state } = view;
  const tr = state.tr;
  view.dispatch(tr.setMeta(copilotKey, ''))
}

export const copilotPlugin = $prose((ctx) => {
  return new Plugin({
    key: copilotKey,
    props: {
      handleKeyDown(_view, event) {
        if (event.key === "Tab") {
          event.preventDefault();
          applyHint(ctx);
          return;
        }
        if (event.key === 'Enter' || event.code === 'Space') {
          getHint(ctx)
          return;
        }

        hideHint(ctx);
      },
      decorations(state) {
        return copilotKey.getState(state).deco;
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
        const message = tr.getMeta(copilotKey);
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
})
