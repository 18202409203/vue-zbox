<script lang="ts" setup>
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
} from "vue";
import { Handler, HandlerGroup } from "./handler";
import type {
  BasicDirection,
  Direction,
  Noop,
  ZBoxEvents,
  ZBoxProps,
  ZMode,
} from "./types";
import { useScroll } from "./useScroll";
import { decomposeDirection } from "./direction";
import { getContainingBlock } from "./containingBlock";

const props = withDefaults(defineProps<ZBoxProps>(), {
  draggable: false,
  resizable: false,
  handlersBit: 0b1111,
  handlerSize: 8,
});

// tackle some defaults
const computedProps = computed(() => ({
  minWidth: props.minWidth || props.handlerSize,
  minHeight: props.minHeight || props.handlerSize,
}));

const computedHandlerSize = computed(() => props.handlerSize + "px");

const $emit = defineEmits<ZBoxEvents>();

const _handlerBit = computed(() => {
  if (props.handlersBit) return props.handlersBit;
  if (props.resizable) return 0b1111;
  return 0;
});

const handlerGroup = new HandlerGroup(_handlerBit.value);
const handlers = handlerGroup.handlers;

const container = ref<HTMLDivElement | null>(null);

// position, top, left
watchEffect(() => {
  const zbox = container.value!;
  if (zbox) {
    zbox.style.position = props.draggable
      ? "absolute"
      : props.resizable
      ? "relative"
      : "static";

    // reset top/left when resizable or draggable changed
    zbox.style.top = "";
    zbox.style.left = "";
  }
});

const { isScrolling } = useScroll(container);
// hide handlers when scrolling
const isShowHandlers = computed(() => {
  return props.resizable && !isScrolling.value;
});

const handlerWrapper = ref<HTMLDivElement | null>(null);
// make sure that handlerWrapper's position is based on zbox's scrollLeft/scrollTop
watch(isShowHandlers, () => {
  const zbox = container.value!;
  if (isShowHandlers.value && handlerWrapper.value) {
    handlerWrapper.value!.style.left = zbox.scrollLeft + "px";
    handlerWrapper.value!.style.top = zbox.scrollTop + "px";
  }
});

const currentDirection = ref<Direction | Noop>(null);
const currentMode = ref<ZMode | Noop>(null);

let startX: number,
  startY: number, // for resizing
  startWidth: number,
  startHeight: number, // for resizing
  positionX: number,
  positionY: number; // for dragging

const onMouseDown = (e: MouseEvent) => {
  positionX = e.clientX;
  positionY = e.clientY;
  // e.preventDefault();
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  if (currentMode.value === "resizing") return;

  currentMode.value = props.draggable ? "dragging" : null;
  currentDirection.value = null;

  if (props.draggable) $emit("drag", e);
};

function onMouseUp(e: MouseEvent) {
  if (currentMode.value === "resizing") {
    $emit("resizeEnd", e);
  } else if (currentMode.value === "dragging") {
    $emit("dragEnd", e);
  }

  currentMode.value = null;
  currentDirection.value = null;

  handlers.forEach((handler) => handler.ref!.classList.remove("active"));

  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  const deltaLeft = e.clientX - positionX;
  const deltaTop = e.clientY - positionY;
  positionX = e.clientX;
  positionY = e.clientY;

  if (currentMode.value === "dragging") {
    updatePosition(deltaLeft, deltaTop);
  } else if (currentMode.value === "resizing") {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    updateSize(dx, dy, deltaLeft, deltaTop);
  }
}

function updatePosition(deltaLeft = 0, deltaTop = 0) {
  const zbox = container.value!;
  const posLeft = zbox.offsetLeft + deltaLeft;
  const posTop = zbox.offsetTop + deltaTop;
  if (!props.limited) {
    const block = getContainingBlock(zbox);
    if (posTop < 0) {
      zbox.style.top = 0 + "px";
      console.log("top exceed");
    } else if (posTop + zbox.offsetHeight > block.offsetHeight) {
      zbox.style.top = block.offsetHeight - zbox.offsetHeight + "px";
      console.log("bottom exceed");
    } else {
      zbox.style.top = posTop + "px";
    }
    if (posLeft < 0) {
      zbox.style.left = 0 + "px";
      console.log("left exceed");
    } else if (posLeft + zbox.offsetWidth > block.offsetWidth) {
      zbox.style.left = block.offsetWidth - zbox.offsetWidth + "px";
      console.log("right exceed");
    } else {
      zbox.style.left = posLeft + "px";
    }
  } else {
    zbox.style.left = posLeft + "px";
    zbox.style.top = posTop + "px";
  }
}

function updateSize(dx = 0, dy = 0, deltaLeft = 0, deltaTop = 0) {
  const zbox = container.value!;

  const dirs: BasicDirection[] = decomposeDirection(currentDirection.value);
  dirs.forEach(function doMove(dir: BasicDirection) {
    switch (dir) {
      case "top":
        if (startHeight - dy <= computedProps.value.minHeight) break;
        zbox.style.height = startHeight - dy + "px";
        if (props.draggable) updatePosition(deltaLeft, deltaTop);
        break;
      case "left":
        if (startWidth - dx <= computedProps.value.minWidth) break;
        zbox.style.width = startWidth - dx + "px";
        if (props.draggable) updatePosition(deltaLeft, deltaTop);
        break;
      case "right":
        if (startWidth + dx <= computedProps.value.minWidth) break;
        zbox.style.width = startWidth + dx + "px";
        break;
      case "bottom":
        if (startHeight + dy <= computedProps.value.minHeight) break;
        zbox.style.height = startHeight + dy + "px";
        break;
      default:
        console.log("Not support direction: " + dir);
        break;
    }
  });
}

// generate handler's mousedown event
const genHandlerMouseDown = (handler: Handler) => (e: MouseEvent) => {
  const zbox = container.value!;
  const handlerElement = handler.ref!;
  if (!props.resizable) return;
  currentMode.value = "resizing";
  currentDirection.value = handler.dir;

  startX = e.clientX;
  startY = e.clientY;
  startWidth = zbox.offsetWidth;
  startHeight = zbox.offsetHeight;
  handlerElement.classList.add("active");

  $emit("resize", e);
};

onMounted(() => {
  const zbox = container.value!;
  zbox.addEventListener("mousedown", onMouseDown);

  handlerGroup.init(genHandlerMouseDown);
});

onBeforeUnmount(() => {
  const zbox = container.value!;
  zbox.removeEventListener("mousedown", onMouseDown);

  handlerGroup.uninit();
});
</script>

<template>
  <div
    ref="container"
    class="zbox__container"
    :class="{ draggable: draggable, resizable: resizable }"
  >
    <div ref="handlerWrapper" class="handler__wrapper" v-show="isShowHandlers">
      <div
        v-for="handler of handlers"
        :key="handler.dir"
        class="handler"
        :class="`${Handler.prefix}-${handler.dir} ${Handler.prefix}__dot`"
        :style="handlerStyle"
      ></div>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.zbox__container {
  &.draggable {
    position: absolute;
    cursor: move;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  &.draggable:active {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    transform: scale(1.02);
  }

  &.resizable {
    position: relative;

    .handler__wrapper {
      position: absolute;
      pointer-events: none;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .handler {
        position: absolute;
        pointer-events: auto;
        background-color: rgba(0, 0, 0, 0.1);
        z-index: 1;
      }

      .handler__dot {
        width: v-bind("computedHandlerSize");
        height: v-bind("computedHandlerSize");
        background-color: #892;
      }

      .handler__dot.handler-top {
        top: 0;
        left: 50%;
        cursor: ns-resize;
        transform: translate(-50%, 0);
      }

      .handler__dot.handler-right {
        top: 50%;
        right: 0;
        cursor: ew-resize;
        transform: translate(0, -50%);
      }

      .handler__dot.handler-bottom {
        bottom: 0;
        left: 50%;
        cursor: ns-resize;
        transform: translate(-50%, 0);
      }

      .handler__dot.handler-left {
        top: 50%;
        left: 0;
        cursor: ew-resize;
        transform: translate(0, -50%);
      }

      .handler__dot.handler-top-left {
        top: 0;
        left: 0;
        cursor: nwse-resize;
      }

      .handler__dot.handler-top-right {
        top: 0;
        right: 0;
        cursor: nesw-resize;
      }

      .handler__dot.handler-bottom-right {
        bottom: 0;
        right: 0;
        cursor: nwse-resize;
      }

      .handler__dot.handler-bottom-left {
        bottom: 0;
        left: 0;
        cursor: nesw-resize;
      }

      .handler-top:hover,
      .handler-right:hover,
      .handler-bottom:hover,
      .handler-left:hover {
        background-color: rgba(17, 133, 242, 0.5);
      }
    }
  }
}
</style>
