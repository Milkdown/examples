import { viteStaticCopy } from 'vite-plugin-static-copy'

export default {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/shiki/dist/*',
          dest: 'dist'
        },
        {
          src: 'node_modules/shiki/themes/*',
          dest: 'themes'
        },
        {
          src: 'node_modules/shiki/languages/*',
          dest: 'languages'
        }
      ]
    })
  ]
}
