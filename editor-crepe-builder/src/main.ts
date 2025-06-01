import { CrepeBuilder } from '@milkdown/crepe/builder';
import { codeMirror } from '@milkdown/crepe/feature/code-mirror';
import { LanguageDescription } from '@codemirror/language';
import { markdown as markdownLanguage } from '@codemirror/lang-markdown';

import { nord } from '@uiw/codemirror-theme-nord';

// only support css needed
import '@milkdown/crepe/theme/common/prosemirror.css'
import '@milkdown/crepe/theme/common/reset.css'
import '@milkdown/crepe/theme/common/code-mirror.css'
import '@milkdown/crepe/theme/nord-dark.css'

const markdown =
  `# Milkdown Editor Crepe

\`\`\`markdown
# This code block only support markdown language.
\`\`\`

> This editor only enabled some part of the features of Crepe.
`

new CrepeBuilder({
  root: '#app',
  defaultValue: markdown,
})
.addFeature(codeMirror, {
  theme: nord,
  languages: [
    LanguageDescription.of({
      name: "Markdown",
      extensions: ["md", "markdown", "mkd"],
      load() {
        return Promise.resolve(markdownLanguage())
      }
    }),
  ]
})
.create()
