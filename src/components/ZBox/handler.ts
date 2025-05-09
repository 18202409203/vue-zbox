import type { Direction } from "./types";

export class Handler {
  dir: Direction = "top";
  static prefix: string = "handler";
  constructor(dir: Direction) {
    this.dir = dir;
  }
  get ref() {
    return document.querySelector<HTMLElement>(
      `.${Handler.prefix}-${this.dir}`
    );
  }
}
