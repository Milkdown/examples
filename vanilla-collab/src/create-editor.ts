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

const createArea = (area: HTMLElement) => {
  const templateForm = document.createElement('div');
  templateForm.classList.add('template-form');

  area.appendChild(templateForm);

  const textarea = document.createElement('textarea');
  textarea.classList.add('template');
  textarea.cols = 50;
  textarea.rows = 2;
  textarea.placeholder = 'Input some markdown here to apply template';
  templateForm.appendChild(textarea);
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  templateForm.appendChild(applyButton);

  const room = document.createElement('div');
  room.classList.add('room');
  area.appendChild(room);
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Switch Room';
  room.appendChild(toggleButton);

  const roomDisplay = document.createElement('span');
  room.appendChild(roomDisplay);
  const roomValue = document.createElement('span');
  roomDisplay.appendChild(document.createTextNode('Room: '));
  roomDisplay.appendChild(roomValue);

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');
  area.appendChild(buttonGroup);

  const connectButton = document.createElement('button');
  connectButton.textContent = 'Connect';
  buttonGroup.appendChild(connectButton);
  const disconnectButton = document.createElement('button');
  disconnectButton.textContent = 'Disconnect';
  buttonGroup.appendChild(disconnectButton);
  const status = document.createElement('span');
  status.classList.add('status');
  buttonGroup.appendChild(status);

  const statusValue = document.createElement('span');
  status.appendChild(document.createTextNode('Status: '));
  status.appendChild(statusValue);

  return {
    applyButton,
    textarea,
    toggleButton,
    connectButton,
    disconnectButton,
    status: statusValue,
    room: roomValue,
  };
}

export const PORT = location.port;
export const HOST = [location.hostname, PORT].filter(Boolean).join(':');
const wsUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${HOST}/__yjs__`;

class CollabManager {
  private room = 'milkdown';
  private doc!: Doc;
  private wsProvider!: WebsocketProvider;
  doms = createArea(this.area);

  constructor(
    private collabService: CollabService,
    private area: HTMLElement,
    private rndInt = Math.floor(Math.random() * 4)
  ) {
    this.doms.room.textContent = this.room;
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
    this.wsProvider.awareness.setLocalStateField('user', options[this.rndInt]);
    this.wsProvider.on('status', (payload: { status: string }) => {
      this.doms.status.textContent = payload.status;
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
    this.doms.room.textContent = this.room;

    const template = this.room === 'milkdown' ? markdown : '# Sandbox Room';
    this.disconnect();
    this.flush(template);
  }
}

export const createEditor = async (root: string, area: string) => {
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
    const collabManager = new CollabManager(
      collabService,
      document.querySelector(area)!
    );
    collabManager.flush(markdown);

    collabManager.doms.connectButton.onclick = () => {
      collabManager.connect();
    }

    collabManager.doms.disconnectButton.onclick = () => {
      collabManager.disconnect();
    }


    collabManager.doms.applyButton.onclick = () => {
      collabManager.applyTemplate(collabManager.doms.textarea.value);
    }

    collabManager.doms.toggleButton.onclick = () => {
      collabManager.toggleRoom();
    }
  });

  return editor;
};
