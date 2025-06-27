import { Component } from "vue";

export type Noop = null | undefined;
export type Direction =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";
export type HandlerType = "dot" | "bar";
export type ZMode = "resizing" | "dragging";

export type ZBoxProps = {
  // NOTE: use binary to represent handlers, 1 means enable, 0 means disable
  // | HEX  | BIN          | DEC | DIRECTION   |
  // | ---- | ------------ | --- | ----------- |
  // | 0x08 | 0b_0000_1000 | 8   | top         |
  // | 0x04 | 0b_0000_0100 | 4   | right       |
  // | 0x02 | 0b_0000_0010 | 2   | bottom      |
  // | 0x01 | 0b_0000_0001 | 1   | left        |
  // | 0x80 | 0b_1000_0000 | 128 | topLeft     |
  // | 0x40 | 0b_0100_0000 | 64  | topRight    |
  // | 0x20 | 0b_0010_0000 | 32  | bottomRight |
  // | 0x10 | 0b_0001_0000 | 16  | bottomLeft  |
  handlersBit?: number;
  handlerType?: HandlerType; // dot, bar

  /**
   * This is bind to handler's style attribute.
   */
  handlerStyle?: any;
  handlerSize?: number;

  resizable?: boolean;
  draggable?: boolean;

  /**
   * Min width of zbox. Generally, it should be greater than `handlerSize` at least.
   */
  minWidth?: number;
  minHeight?: number;
};

export type ZBoxEvents = {
  (e: "resize", p: MouseEvent): void;
  (e: "drag", p: MouseEvent): void;
  (e: "resizeEnd", p: MouseEvent): void;
  (e: "dragEnd", p: MouseEvent): void;
};

declare const ZBox: Component<ZBoxProps, {}, ZBoxEvents>;

export default ZBox;
