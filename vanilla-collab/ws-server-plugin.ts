import { WebSocketServer } from 'ws'
import { Plugin, ViteDevServer } from 'vite'
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils'


const createWsServer = (server: ViteDevServer) => {
    const wss = new WebSocketServer({ noServer: true })

    server.httpServer?.on('upgrade', (request, socket, head) => {
        console.log(request.url)
        if (!request.url) return;

        const url = new URL(request.url, 'http://localhost');
        const { pathname } = url;

        if (!pathname.includes('/__yjs__/')) return;

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request)
            setupWSConnection(ws, request)
        })
    })
}

export const wsServerPlugin = (): Plugin => {
    return {
        name: 'y-ws-server-plugin',
        apply: 'serve',
        configureServer(server) {
            createWsServer(server)
        }
    }
}
