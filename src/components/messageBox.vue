<script setup>
import { isGloballyWhitelisted } from "@vue/shared";
import moment from "moment";

moment.locale("de");

const props = defineProps({
  message: String,
  username: String,
  usernameColor: String,
  firstMsg: Boolean,
  timeSent: Number,
  actTime: Number,
  avatarUrl: String,
  isFollower: Boolean,
});

// Username Color
const userStyle = { color: props.usernameColor };

// Box Color
// follower && !firstMsg: #000517
// firstMsg: #00bc26
// !follower && !firstMsg: grau
let boxColor = "black";
if (props.isFollower && !props.firstMsg) boxColor = "#000517";
if (props.firstMsg) boxColor = "#00bc26";

const boxStyle = { backgroundColor: boxColor };
</script>

<template>
  <div :style="boxStyle" class="messageBox">
    <div class="userInfo">
      <img class="avatar" v-if="props.avatarUrl" :src="props.avatarUrl" />
      <h3 :style="userStyle">
        {{ props.username }}
      </h3>
    </div>
    <p class="message">{{ props.message }}</p>
    <p class="timeAgo">{{ moment(props.timeSent).fromNow() }}</p>
  </div>
</template>

<style scoped>
.messageBox {
  width: 100%;
  border-radius: 10px;
  margin: 0rem 0rem 0.25rem 0rem;
  padding: 0.5rem;
  animation: newMessage 1s;
}
.message {
  max-width: 100%;
  word-break: break-all;
}
.timeAgo {
  margin-top: 1rem;
  color: gray;
}
.avatar {
  width: 35px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.userInfo {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
}
@keyframes newMessage {
  0% {
    translate: 101vw 0;
  }
  100% {
    translate: none;
  }
}
</style>
