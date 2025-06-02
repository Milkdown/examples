import { markRule } from "@milkdown/kit/prose"
import { $inputRule } from "@milkdown/kit/utils"
import { markSchema } from "./mark-schema"

export const markInputRule = $inputRule((ctx) => {
  return markRule(/(?:\=\=)(?:\{([^}]+)\})?([^=]+)(?:\=\=)$/, markSchema.type(ctx), {
    getAttr: (match) => {
      const color = match[1]
      return {
        color: color || null,
      }
    },
  })
})