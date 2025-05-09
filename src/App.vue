<script setup lang="ts">
import ZBox from './components/ZBox/ZBox.vue'
</script>

<template>
  <div style="position: absolute; left: 200px">
    <h1>ZBox</h1>
    <p>Hello!</p>
    <ZBox class="box" :draggable="true" :resizable="true">
      <div class="content">
        <h1>Inner Text</h1>
        <p>Hello World!</p>
        <div class="item"></div>
      </div>
    </ZBox>
    <p>World</p>
  </div>
</template>

<style scoped>
.box {
  border: 1px solid #ccc;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
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
