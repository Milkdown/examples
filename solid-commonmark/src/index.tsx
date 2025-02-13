/* @refresh reload */
import { render } from "solid-js/web";

import Milkdown from "./components/Milkdown";

const root = document.getElementById("app");

render(() => <Milkdown />, root!);
