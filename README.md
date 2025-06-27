# ZBox

`ZBox` is a simple VUE component lib which you can `resize` or `drag` the content DOM.

# How to use

```vue
<ZBox
  draggable
  resizable
  :handlers-bit="0b1010"
  handler-style="background-color: red"
  @drag="onDrag"
  @resize="onResize"
  @dragEnd="onDragEnd"
  @resizeEnd="onResizeEnd"
>
  <YourContentDOM />
</ZBox>
```

## Props and Events

The prop `handlersBit` you should notice:

| HEX  | BIN          | DEC | DIRECTION   |
| ---- | ------------ | --- | ----------- |
| 0x08 | 0b_0000_1000 | 8   | top         |
| 0x04 | 0b_0000_0100 | 4   | right       |
| 0x02 | 0b_0000_0010 | 2   | bottom      |
| 0x01 | 0b_0000_0001 | 1   | left        |
| 0x80 | 0b_1000_0000 | 128 | topLeft     |
| 0x40 | 0b_0100_0000 | 64  | topRight    |
| 0x20 | 0b_0010_0000 | 32  | bottomRight |
| 0x10 | 0b_0001_0000 | 16  | bottomLeft  |

You can compose those directions freely.

```ts
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
   * Min width of zbox. Generally, it should be greater than `handlerSize` at least.
   */
  minWidth?: number;
  minHeight?: number;
};
```

And some events you maybe need.

```ts
export type ZBoxEvents = {
  (e: "resize", p: MouseEvent): void;
  (e: "drag", p: MouseEvent): void;
  (e: "resizeEnd", p: MouseEvent): void;
  (e: "dragEnd", p: MouseEvent): void;
};
```

# Further

Our position strategy is based on `top/left`.
