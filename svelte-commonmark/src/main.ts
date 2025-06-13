import { mount } from 'svelte';
import "@milkdown/theme-nord/style.css";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;