import type { FC } from "react";

import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const markdown = `# Milkdown React Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **React**.`;

export const MilkdownEditor: FC = () => {
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: markdown,
    });
    return crepe;
  }, []);

  return <Milkdown />;
};
