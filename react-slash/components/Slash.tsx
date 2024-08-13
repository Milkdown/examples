import { editorViewCtx } from "@milkdown/kit/core"
import { Ctx } from "@milkdown/kit/ctx"
import { slashFactory, SlashProvider } from "@milkdown/kit/plugin/slash"
import { createCodeBlockCommand } from "@milkdown/kit/preset/commonmark"
import { useInstance } from '@milkdown/react'
import { callCommand } from "@milkdown/kit/utils"
import { usePluginViewContext } from "@prosemirror-adapter/react"
import React, { useCallback, useEffect, useRef } from "react"

export const slash = slashFactory('Commands');

export const SlashView = () => {
    const ref = useRef<HTMLDivElement>(null)
    const slashProvider = useRef<SlashProvider>()

    const { view, prevState } = usePluginViewContext()
    const [loading, get] = useInstance()
    const action = useCallback((fn: (ctx: Ctx) => void) => {
        if (loading) return;
        get().action(fn)
    }, [loading])

    useEffect(() => {
        const div = ref.current
        if (loading || !div) {
            return;
        }
        slashProvider.current = new SlashProvider({
            content: div,
        })

        return () => {
            slashProvider.current?.destroy()
        }
    }, [loading])

    useEffect(() => {
        slashProvider.current?.update(view, prevState)
    })

    const command = (e: React.KeyboardEvent | React.MouseEvent) => {
        e.preventDefault() // Prevent the keyboad key to be inserted in the editor.
        action((ctx) => {
            const view = ctx.get(editorViewCtx);
            const { dispatch, state } = view;
            const { tr, selection } = state;
            const { from } = selection;
            dispatch(tr.deleteRange(from - 1, from))
            view.focus()
            return callCommand(createCodeBlockCommand.key)(ctx)
        })
    }

    return (
        <div ref={ref} aria-expanded="false" className="absolute data-[show='false']:hidden">
            <button
                className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
                onKeyDown={(e) => command(e)}
                onMouseDown={(e) => { command(e)}}
            >
                Code Block
            </button>
        </div>
    )
}
