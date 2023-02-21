import { defineConfig } from "vite"
import { wsServerPlugin } from "./ws-server-plugin"

export default defineConfig({
  plugins: [wsServerPlugin()]
})
