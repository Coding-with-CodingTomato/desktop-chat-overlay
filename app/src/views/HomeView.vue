<script setup>
const client = new tmi.Client({ channels: ["codingtomato"] });
client.connect().catch(console.error);

client.on("message", (channel, tags, message, self) => {
  // "Alca: Hello, World!"
  console.log(`${tags["display-name"]}: ${message}`);
});
</script>

<template>
  <div class="home">
    <h1>Test</h1>
    <h3>{{ counter }}</h3>
    <button @click="addCounter">Counter + 1</button>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.home {
  width: 100vw;
  height: 100vh;
  background-color: black;
  margin: 0;
  color: white;
}
</style>
