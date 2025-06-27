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

export const HANDLERS: Direction[] = [
  "left",
  "bottom",
  "right",
  "top",
  "bottom-left",
  "bottom-right",
  "top-right",
  "top-left",
];

export class HandlerGroup {
  handlers: Handler[] = [];
  flag: number = 0b1111;
  constructor(flag = 0b1111) {
    this.flag = flag;
    this.handlers = this._parseHandlers();
  }
  init(onMouseDownFactory: (h: Handler) => (e: MouseEvent) => void) {
    this.handlers.forEach((handler) =>
      handler.init(onMouseDownFactory(handler))
    );
  }
  uninit() {
    this.handlers.forEach((handler) => handler.uninit());
  }
  _parseHandlers() {
    const n = this.flag || 0b1111;
    return HANDLERS.reduce<Handler[]>((acc, dir, i) => {
      if ((n >> i) & 1) {
        acc.push(new Handler(dir));
      }
      return acc;
    }, []);
  }
}
