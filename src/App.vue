<script setup lang="ts">
import { ref } from "vue";
import ZBox from "./components/ZBox/ZBox.vue";
import HelloWorld from "./components/HelloWorld.vue";

const resizable = ref(false);
const draggable = ref(false);
</script>

<template>
  <div style="position: absolute; left: 200px">
    <h1>ZBox</h1>
    <input type="checkbox" v-model="resizable" />
    <label>resizable</label>
    <input type="checkbox" v-model="draggable" />
    <label>draggable</label>
    <p>Hello!</p>
    <ZBox class="box" :draggable="draggable" :resizable="resizable" :handlers-bit="0b1010">
      <div class="content">
        <h1>Inner Text</h1>
        <p>Hello World!</p>
        <div class="item"></div>
      </div>
      <HelloWorld msg="Hello ZBox"/>
    </ZBox>
    <p>World!</p>
  </div>
</template>

<style scoped>
.box {
  border: 1px solid #ccc;
  overflow-x: hidden;
  overflow-y: auto;
  width: 200px;
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
