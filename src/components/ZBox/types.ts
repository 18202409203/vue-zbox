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
export type HandlerStyle = "dot" | "bar";
export type ZMode = "resizing" | "dragging";

export type ZBoxProps = {
  // NOTE: use binary to represent handlers, 1 means enable, 0 means disable
  // 0b_0000_0001: top     0b_0000_0010: right    0b_0000_0100: bottom      0b_0000_1000: left
  // 0b_0001_0000: topLeft 0b_0010_0000: topRight 0b_0100_0000: bottomRight 0b_1000_0000: bottomLeft
  handlersBit?: number;
  handlerStyle?: HandlerStyle; // dot, bar

  resizable?: boolean;
  draggable?: boolean;
};

export type ZBoxEvents = {
  (e: "resize", p: MouseEvent): void;
  (e: "drag", p: MouseEvent): void;
  (e: "resizeEnd", p: MouseEvent): void;
  (e: "dragEnd", p: MouseEvent): void;
};
