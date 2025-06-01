# ZBox

`ZBox` is a simple VUE component lib which you can `resize` or `drag` the content DOM.

# How to use

The prop `handlersBit` you should notice:

```ts
export type ZBoxProps = {
  // NOTE: use binary to represent handlers, 1 means enable, 0 means disable
  // 0b_0000_0001: top     0b_0000_0010: right    0b_0000_0100: bottom      0b_0000_1000: left
  // 0b_0001_0000: topLeft 0b_0010_0000: topRight 0b_0100_0000: bottomRight 0b_1000_0000: bottomLeft
  handlersBit?: number;
  handlerStyle?: HandlerStyle; // dot, bar

  resizable?: boolean;
  draggable?: boolean;
};
```

And some events you maybe need.

```js
import "zbox/dist/zbox.css"
import { ZBox } from "zbox";

<ZBox
    :draggable="draggable"
    :resizable="resizable"
    :handlers-bit="0b1010"
    @drag="onDrag"
    @resize="onResize"
    @dragEnd="onDragEnd"
    @resizeEnd="onResizeEnd"
>
```