import { Component } from "vue";

export type Noop = null | undefined;

export type BasicDirection = "top" | "bottom" | "left" | "right";

export type Direction =
  | BasicDirection
  | "top-left"
  | "bottom-left"
  | "bottom-right"
  | "top-right";

export type ZMode = "resizing" | "dragging";

export type ZBoxProps = {
  /**
   * NOTE: use binary to represent handlers, 1 means enable, 0 means disable
   * Default is 0b1111.
   */
  handlersBit?: number;

  /**
   * This is bind to handler's style attribute.
   */
  handlerStyle?: any;
  handlerSize?: number;

  resizable?: boolean;
  draggable?: boolean;

  /**
   * Whether zbox can be limited within the [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Containing_block#identifying_the_containing_block) while dragging.
   */
  limited?: boolean;

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
