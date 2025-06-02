import { Ctx } from "@milkdown/kit/ctx";
import { tooltipFactory, TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { EditorState, TextSelection } from "@milkdown/kit/prose/state";
import { EditorView } from "@milkdown/kit/prose/view";
import { DEFAULT_COLOR, markSchema } from "./mark-schema";
import { debounce } from "lodash-es";
import { editorViewCtx } from "@milkdown/kit/core";
import { Mark } from "@milkdown/kit/prose/model";

class TooltipPluginView {
  content: HTMLDivElement;
  colorPicker: HTMLInputElement;
  provider: TooltipProvider;
  ctx: Ctx;

  currentMark: Mark | null = null;

  listener = debounce((e: Event) => {
    const color = (e.target as HTMLInputElement).value;

    const view = this.ctx.get(editorViewCtx);
    if (!view.state || !this.currentMark) return;

    const { state } = view;
    const { selection } = state;
    const { from, to } = selection;

    const markType = markSchema.type(this.ctx);

    const tr = state.tr;

    tr.removeMark(from, to, markType);

    tr.addMark(from, to, markType.create({ color }));

    view.dispatch(tr);
  }, 20);

  constructor(ctx: Ctx) {
    this.ctx = ctx;
    this.content = document.createElement("div");
    this.content.classList.add("milkdown-color-picker");
    this.colorPicker = document.createElement("input");
    this.colorPicker.type = "color";
    this.colorPicker.value = DEFAULT_COLOR;
    this.colorPicker.addEventListener("input", this.listener);
    this.content.appendChild(this.colorPicker);

    this.provider = new TooltipProvider({
      content: this.content,
      floatingUIOptions: {
        placement: "right"
      },
      shouldShow: () => {
        const view = ctx.get(editorViewCtx);
        if (!view.state) return false;
        const { doc, selection } = view.state;
        const { from, to } = selection;
        const isEmptyTextBlock =
          !doc.textBetween(from, to).length &&
          selection instanceof TextSelection;

        if (isEmptyTextBlock) {
          return false;
        }

        const markType = markSchema.type(ctx);
        if (!markType) {
          return false;
        }

        let hasMark = false;
        doc.nodesBetween(from, to, (node) => {
          if (markType.isInSet(node.marks)) {
            hasMark = true;
            this.currentMark = node.marks.find((m) => m.type === markType) ?? null;
            return false;
          }
          return true;
        });

        return hasMark;
      },
    });

    this.provider.onShow = () => {
      const color = this.currentMark?.attrs.color;
      this.colorPicker.value = color ?? DEFAULT_COLOR;
    }
  }

  update(updatedView: EditorView, prevState: EditorState) {
    this.provider.update(updatedView, prevState);
  }

  destroy() {
    this.provider.destroy();
    this.content.remove();
    this.colorPicker.removeEventListener("input", this.listener);
    this.colorPicker.remove();
  }
}


export const colorPickerTooltip = tooltipFactory("color-picker");

export const colorPickerTooltipConfig = (ctx: Ctx) => {
  ctx.set(colorPickerTooltip.key, {
    view: () => new TooltipPluginView(ctx),
  });
};
