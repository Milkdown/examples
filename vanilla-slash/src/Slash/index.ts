import { slashFactory, SlashProvider } from "@milkdown/kit/plugin/slash"
import type { EditorView } from '@milkdown/kit/prose/view'
import type { EditorState } from '@milkdown/kit/prose/state'
import { commandsCtx, editorViewCtx } from '@milkdown/kit/core'
import type { Ctx } from '@milkdown/kit/ctx'
import { createCodeBlockCommand } from "@milkdown/kit/preset/commonmark";

export const slash = slashFactory('Command')

const removeSlash = (ctx: Ctx) => {
  const view = ctx.get(editorViewCtx);
  view.dispatch(
    view.state.tr.delete(
      view.state.selection.from - 1,
      view.state.selection.from
    )
  );
}

export function slashPluginView(view: EditorView) {
  const content = document.createElement('div');
  content.className = "absolute data-[show='false']:hidden";
  const commandList = [
    {
      onSelect: (ctx: Ctx) => {
        ctx.get(commandsCtx).call(createCodeBlockCommand.key)
      },
      text: 'Code Block',
    }
  ].map(item => {
    return {
      ...item,
      onSelect: () => {
        const ctx: Ctx = globalThis.__milkdown__.ctx
        removeSlash(ctx)
        item.onSelect(ctx)
        view.focus()
      }
    }
  })

  commandList.forEach((item) => {
    const div = document.createElement('p')
    div.ariaExpanded = "false"

    const button = document.createElement('button')
    button.innerText = item.text
    button.className = "text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"

    div.appendChild(button)
    content.appendChild(div)

    button.addEventListener('mousedown', (e) => {
      e.preventDefault()
      item.onSelect()
    })
    button.addEventListener('keydown', (e) => {
        e.preventDefault()
      if(e.key === 'Enter') {
        item.onSelect()
      }
    })
  })

  const provider = new SlashProvider({
    content,
  });

  return {
    update: (updatedView: EditorView, prevState: EditorState) => {
      provider.update(updatedView, prevState)
    },
    destroy: () => {
      provider.destroy();
      content.remove();
    }
  }
}
