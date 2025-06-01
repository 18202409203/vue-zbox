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
import type { Direction, Noop, ZBoxEvents, ZBoxProps, ZMode } from "./types";
import { useScroll } from "./useScroll";

const props = withDefaults(defineProps<ZBoxProps>(), {
  draggable: false,
  resizable: false,
  handlersBit: 0b1111,
  handlerStyle: "dot",
});

const $emit = defineEmits<ZBoxEvents>();

const handlerGroup = new HandlerGroup(props.handlersBit);
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
  const zbox = container.value!;
  const deltaLeft = e.clientX - positionX;
  const deltaTop = e.clientY - positionY;
  positionX = e.clientX;
  positionY = e.clientY;

  if (currentMode.value === "dragging") {
    zbox.style.left = zbox.offsetLeft + deltaLeft + "px";
    zbox.style.top = zbox.offsetTop + deltaTop + "px";
  } else if (currentMode.value === "resizing") {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    switch (currentDirection.value) {
      case "top":
        zbox.style.height = startHeight - dy + "px";
        if (props.draggable) zbox.style.top = zbox.offsetTop + deltaTop + "px";
        break;
      case "left":
        zbox.style.width = startWidth - dx + "px";
        if (props.draggable)
          zbox.style.left = zbox.offsetLeft + deltaLeft + "px";
        break;
      case "right":
        zbox.style.width = startWidth + dx + "px";
        break;
      case "bottom":
        zbox.style.height = startHeight + dy + "px";
        break;
      default:
        console.log("error");
        break;
    }
  }
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
        :class="`${Handler.prefix}-${handler.dir} ${Handler.prefix}__${props.handlerStyle}`"
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
      --handler-bar-size: 4px;
      --handler-dot-size: 8px;
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

      .handler__bar.handler-top {
        top: 0;
        left: 0;
        width: 100%;
        height: var(--handler-bar-size);
        cursor: ns-resize;
      }

      .handler__bar.handler-right {
        top: 0;
        right: 0;
        width: var(--handler-bar-size);
        height: 100%;
        cursor: ew-resize;
      }

      .handler__bar.handler-bottom {
        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--handler-bar-size);
        cursor: ns-resize;
      }

      .handler__bar.handler-left {
        top: 0;
        left: 0;
        width: var(--handler-bar-size);
        height: 100%;
        cursor: ew-resize;
      }

      .handler__dot {
        width: var(--handler-dot-size);
        height: var(--handler-dot-size);
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
