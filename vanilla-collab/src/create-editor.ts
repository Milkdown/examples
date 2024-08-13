import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import {
  collab,
  CollabService,
  collabServiceCtx,
} from '@milkdown/plugin-collab';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';
import { name } from './name';

const markdown = `
# Milkdown Vanilla Collab

> You're scared of a world where you're needed.

---

Now you can play!
`;

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

const options = name.map((x) => ({
  color: `#${randomColor()}`,
  name: x,
}));

const rndInt = Math.floor(Math.random() * 4);

const status$ = document.getElementById('status');
const connect$ = document.getElementById('connect');
const disconnect$ = document.getElementById('disconnect');

const apply$ = document.getElementById('apply');
const template$ = document.getElementById('template');

const room$ = document.getElementById('room');
const toggle$ = document.getElementById('toggle');

export const PORT = location.port;
export const HOST = [location.hostname, PORT].filter(Boolean).join(':');
const wsUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${HOST}/__yjs__`;

class CollabManager {
  private room = 'milkdown';
  private doc!: Doc;
  private wsProvider!: WebsocketProvider;

  constructor(private collabService: CollabService) {
    if (room$) {
      room$.textContent = this.room;
    }
  }

  flush(template: string) {
    this.doc?.destroy();
    this.wsProvider?.destroy();

    this.doc = new Doc();
    this.wsProvider = new WebsocketProvider(
      wsUrl,
      this.room,
      this.doc,
      { connect: true }
    );
    this.wsProvider.awareness.setLocalStateField('user', options[rndInt]);
    this.wsProvider.on('status', (payload: { status: string }) => {
      if (status$) {
        status$.innerText = payload.status;
      }
    });

    this.collabService
      .bindDoc(this.doc)
      .setAwareness(this.wsProvider.awareness);
    this.wsProvider.once('synced', async (isSynced: boolean) => {
      if (isSynced) {
        this.collabService.applyTemplate(template).connect();
      }
    });
  }

  connect() {
    this.wsProvider.connect();
    this.collabService.connect();
  }

  disconnect() {
    this.collabService.disconnect();
    this.wsProvider.disconnect();
  }

  applyTemplate(template: string) {
    this.collabService
      .disconnect()
      .applyTemplate(template, () => true)
      .connect();
  }

  toggleRoom() {
    this.room = this.room === 'milkdown' ? 'milkdown-sandbox' : 'milkdown';
    if (room$) {
      room$.textContent = this.room;
    }

    const template = this.room === 'milkdown' ? markdown : '# Sandbox Room';
    this.disconnect();
    this.flush(template);
  }
}

export const createEditor = async (root: string) => {
  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, document.querySelector(root));
      ctx.set(defaultValueCtx, markdown);
    })
    .config(nord)
    .use(commonmark)
    .use(collab)
    .create();

  editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);
    const collabManager = new CollabManager(collabService);
    collabManager.flush(markdown);

    if (connect$) {
      connect$.onclick = () => {
        collabManager.connect();
      };
    }

    if (disconnect$) {
      disconnect$.onclick = () => {
        collabManager.disconnect();
      };
    }

    if (apply$ && template$) {
      apply$.onclick = () => {
        if (template$ instanceof HTMLTextAreaElement) {
          collabManager.applyTemplate(template$.value);
        }
      };
    }

    if (toggle$) {
      toggle$.onclick = () => {
        collabManager.toggleRoom();
      };
    }
  });

  return editor;
};
