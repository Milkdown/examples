import { MilkdownProvider } from '@milkdown/react'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.css'

import { MilkdownEditor } from './components/Editor'

const root$ = document.getElementById('app')
if (!root$)
  throw new Error('No root element found')

const root = createRoot(root$)

root.render(
  <StrictMode>
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  </StrictMode>,
)
