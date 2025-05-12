import type { Direction } from "./types";

export class Handler {
  dir: Direction = "top";
  _onMouseDown: (e: MouseEvent) => void = () => {};
  static prefix: string = "handler";
  constructor(dir: Direction) {
    this.dir = dir;
  }

  get ref() {
    return document.querySelector<HTMLElement>(
      `.${Handler.prefix}-${this.dir}`
    );
  }

  init(onMouseDown: (e: MouseEvent) => void) {
    this._onMouseDown = onMouseDown;
    this.ref?.addEventListener("mousedown", this._onMouseDown);
  }

  uninit() {
    this.ref?.removeEventListener("mousedown", this._onMouseDown);
  }
}
