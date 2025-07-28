<script setup lang="ts">
import { ref } from "vue";
import ZBox from "./components/ZBox/ZBox.vue";
import HelloWorld from "./components/HelloWorld.vue";

const resizable = ref(true);
const draggable = ref(true);
const limited = ref(true);

function onDrag(e: MouseEvent) {
  console.log("drag");
  console.log(e);
}

function onResize(e: MouseEvent) {
  console.log("resize");
  console.log(e);
}

function onDragEnd(e: MouseEvent) {
  console.log("drag end");
  console.log(e);
}

function onResizeEnd(e: MouseEvent) {
  console.log("resize end");
  console.log(e);
}
</script>

<template>
  <div class="app-box">
    <h1>ZBox</h1>
    <input type="checkbox" v-model="resizable" />
    <label>resizable</label>
    <input type="checkbox" v-model="draggable" />
    <label>draggable</label>
    <input type="checkbox" v-model="limited" />
    <label>limited</label>
    <p>Hello!</p>
    <ZBox
      class="box"
      :limited="limited"
      :draggable="draggable"
      :resizable="resizable"
      :handlers-bit="0b11111111"
      handler-style="background-color: red"
      :min-height="96"
      :min-width="96"
      @drag="onDrag"
      @resize="onResize"
      @dragEnd="onDragEnd"
      @resizeEnd="onResizeEnd"
    >
      <div class="content">
        <h1>Inner Text</h1>
        <p>Hello World!</p>
        <input type="text" />
        <div class="item"></div>
      </div>
      <HelloWorld msg="Hello ZBox" />
    </ZBox>
    <p>World!</p>
  </div>
</template>

<style scoped>
.app-box {
  position: relative;
  top: 100px;
  left: 200px;
  border: 1px solid #ccc;
  height: 600px;
  width: 400px;
}

.box {
  border: 1px solid #ccc;
  overflow-x: hidden;
  overflow-y: auto;
  width: 600px;
  height: 200px;
  background-color: aqua;
}
.content {
  width: 100px;
  height: 300px;
  background-color: rebeccapurple;
  overflow-x: hidden;
  overflow-y: auto;
}

.item {
  width: 100px;
  height: 100px;
  margin: 8px;
  background-color: red;
}
</style>
