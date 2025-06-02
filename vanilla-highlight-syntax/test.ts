import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { remarkMarkColor } from './src/remark-mark-color'

const parserProcessor = unified().use(remarkParse).use(remarkMarkColor)
const stringifierProcessor = unified().use(remarkStringify).use(remarkMarkColor)

const markdown = `
This is a paragraph contains some ==highlighted text==.

This is a =={#ff0}red text==.
`

const tree = parserProcessor.parse(markdown)

console.log('--AST--')
console.log(JSON.stringify(tree, null, 2))

console.log('\n---\n')

const str = stringifierProcessor.stringify(tree)

console.log('--MARKDOWN--')
console.log(str)


/**
 * tree should contain AST:
 * [
 *   // somewhere in the tree
 *   {
 *     type: 'mark',
 *     children: [
 *       {
 *         type: 'text',
 *         value: 'highlighted text'
 *       }
 *     ]
 *   }
 *   // somewhere in the tree
 *   {
 *     type: 'mark',
 *     data: {
 *       color: '#ff0'
 *     },
 *     children: [
 *       {
 *         type: 'text',
 *         value: 'red text'
 *       }
 *     ]
 *   }
 * ]
 *
 */