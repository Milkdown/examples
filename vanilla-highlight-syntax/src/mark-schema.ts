import { $markSchema } from "@milkdown/kit/utils";
import { Mark } from "mdast";

export const markSchema = $markSchema('mark', () => {
  return {
    attrs: {
      color: {
        default: 'yellow',
        validate: 'string'
      }
    },
    parseDOM: [
      {
        tag: 'mark',
        getAttrs: (node: HTMLElement) => {
          return {
            color: node.style.backgroundColor
          }
        }
      }
    ],
    toDOM: (mark) => ['mark', { style: `background-color: ${mark.attrs.color}` }],
    parseMarkdown: {
      match: (node) => node.type === 'mark',
      runner: (state, node, markType) => {
        const color = (node as Mark).data?.color
        state.openMark(markType, { color })
        state.next(node.children)
        state.closeMark(markType)
      }
    },
    toMarkdown: {
      match: (node) => node.type.name === 'mark',
      runner: (state, mark) => {
        let color = mark.attrs.color
        if (color === 'yellow') {
          color = undefined
        }
        state.withMark(mark, 'mark', undefined, {
          color
        })
      }
    }
  }
})