<script setup>
import { ref } from "vue";
import messageBox from "./components/messageBox.vue";

const client = new tmi.Client({ channels: ["codingtomato"] });
client.connect().catch(console.error);

const messages = ref([]);
const actTime = ref(Date.now());

setInterval(() => {
  actTime.value = Date.now();
}, 1000);

client.on("message", (channel, tags, message, self) => {
  messages.value.unshift({
    id: tags["id"],
    username: tags["display-name"],
    message: message,
    usernameColor: tags["color"],
    firstMsg: tags["first-msg"],
    timeSent: Date.now(),
    actTime: actTime,
  });
  console.log(tags, message);
});
</script>

<template>
  <div class="content">
    <messageBox
      v-for="m in messages"
      :key="m.id"
      :message="m.message"
      :username="m.username"
      :usernameColor="m.usernameColor"
      :firstMsg="m.firstMsg"
      :timeSent="m.timeSent"
      :actTime="m.actTime"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Source Sans Pro", sans-serif;
}
.content {
  width: 100vw;
  height: 100vh;
  background-color: black;
  margin: 0;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}
</style>
