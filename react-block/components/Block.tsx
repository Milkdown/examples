import { BlockProvider } from "@milkdown/kit/plugin/block"
import { useInstance } from '@milkdown/react'
import { useEffect, useRef } from "react"

export const BlockView = () => {
    const ref = useRef<HTMLDivElement>(null)
    const tooltipProvider = useRef<BlockProvider>()

    const [loading, get] = useInstance()

    useEffect(() => {
        const div = ref.current
        if (loading || !div) return;

        const editor = get();
        if (!editor) return;

        tooltipProvider.current = new BlockProvider({
            ctx: editor.ctx,
            content: div,
        })
        tooltipProvider.current?.update()

        return () => {
            tooltipProvider.current?.destroy()
        }
    }, [loading])

    return (
        <div ref={ref} className="absolute w-6 bg-slate-200 rounded hover:bg-slate-300 cursor-grab">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
        </div>
    )
}
