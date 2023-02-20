import { usePluginViewContext } from '@prosemirror-adapter/react'

export const Size = () => {
  const { view } = usePluginViewContext()
  const size = view.state.doc.textContent.length
  return (
    <div className='text-right'>
        <span className='text-gray-600 bg-slate-300 p-2 rounded-lg'>
            Text count: {size}
        </span>
    </div>
  )
}
