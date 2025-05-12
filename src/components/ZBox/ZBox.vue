<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { Handler } from "./handler";
import type { Direction, Noop, ZMode } from "./types";

const handlers: Handler[] = [
  new Handler("top"),
  new Handler("right"),
  new Handler("bottom"),
  new Handler("left"),
];

const props = defineProps<{
  resizable?: boolean;
  draggable?: boolean;
}>();

const container = ref<HTMLDivElement | null>(null);
const currentDirection = ref<Direction | Noop>(null);
const currentMode = ref<ZMode | Noop>(null);

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

// remove scroll's listener when resizable is false
watch(
  () => props.resizable,
  () => {
    const zbox = container.value!;
    if (props.resizable) {
      zbox.addEventListener("scroll", onScroll);
    } else {
      zbox.removeEventListener("scroll", onScroll);
    }
  }
);

let startX: number,
  startY: number, // for resizing
  startWidth: number,
  startHeight: number, // for resizing
  positionX: number,
  positionY: number; // for dragging

const onMouseDown = (e: MouseEvent) => {
  positionX = e.clientX;
  positionY = e.clientY;
  e.preventDefault();
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  if (currentMode.value === "resizing") return;

  currentMode.value = props.draggable ? "dragging" : null;
  currentDirection.value = null;
};

function onMouseUp() {
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

const handlerWrapper = ref<HTMLDivElement | null>(null);
const isShowHandlers = ref(true);

// hide handlers when scrolling
let scrollTimer: number | null = null;
function onScroll() {
  if (!props.resizable) return;
  const zbox = container.value!;
  isShowHandlers.value = false;

  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    handlerWrapper.value!.style.left = zbox.scrollLeft + "px";
    handlerWrapper.value!.style.top = zbox.scrollTop + "px";
    isShowHandlers.value = true;
    scrollTimer = null;
  }, 200);
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
};

onMounted(() => {
  const zbox = container.value!;

  zbox.addEventListener("mousedown", onMouseDown);
  zbox.addEventListener("scroll", onScroll);

  handlers.forEach((handler) => {
    handler.init(genHandlerMouseDown(handler));
  });
});

onUnmounted(() => {
  const zbox = container.value!;

  zbox.removeEventListener("mousedown", onMouseDown);
  zbox.removeEventListener("scroll", onScroll);

  handlers.forEach((handler) => {
    handler.uninit();
  });
});
</script>

<template>
  <div
    ref="container"
    class="zbox_container"
    :class="{ draggable: draggable, resizable: resizable }"
  >
    <div ref="handlerWrapper" class="handler_wrapper" v-show="isShowHandlers">
      <div
        v-for="handler of handlers"
        :key="handler.dir"
        class="handler"
        :class="`${Handler.prefix}-${handler.dir}`"
      ></div>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.zbox_container {
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

    .handler_wrapper {
      --handler-size: 5px;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .handler {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.1);
      }

      .handler-top {
        top: 0;
        left: 0;
        width: 100%;
        height: var(--handler-size);
        cursor: ns-resize;
      }

      .handler-right {
        top: 0;
        right: 0;
        width: var(--handler-size);
        height: 100%;
        cursor: ew-resize;
      }

      .handler-bottom {
        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--handler-size);
        cursor: ns-resize;
      }

      .handler-left {
        top: 0;
        left: 0;
        width: var(--handler-size);
        height: 100%;
        cursor: ew-resize;
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
