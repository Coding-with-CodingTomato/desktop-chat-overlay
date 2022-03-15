<script setup>
import moment from "moment";
import DOMPurify from "dompurify";
import { onMounted, ref } from "vue";
import { parseEmotes } from "../lib/parseEmote";
import hackerImage from "../assets/hacker.gif";

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
  emotes: Object,
  emote_only: Boolean,
});

// Emote Width
let emoteWidthPx = 50;
if (props.emote_only) {
  emoteWidthPx = 90;
}

// Cleaned Message
let cleanedMessage = DOMPurify.sanitize(props.message, {
  ALLOWED_TAGS: [
    "small",
    "mark",
    "i",
    "b",
    "s",
    "u",
    "em",
    "h1",
    "h2",
    "h3",
    "sup",
    "sub",
    "p",
    "fieldset",
    "legend",
  ],
  ALLOWED_ATTR: [],
});
if (DOMPurify.removed.length > 1)
  cleanedMessage = `<img src='${hackerImage}' style='width: 60%; margin-left: 15%' />`;
const parsedMessage = ref(cleanedMessage);

// Username Color
const userStyle = { color: props.usernameColor };

// Box Color
let boxColor = "black";
if (props.isFollower && !props.firstMsg) boxColor = "#000517";
if (props.firstMsg) boxColor = "#00bc26";

const boxStyle = { backgroundColor: boxColor };

onMounted(async () => {
  parsedMessage.value = await parseEmotes(
    cleanedMessage,
    props.emotes,
    emoteWidthPx
  );
});
</script>

<template>
  <div :style="boxStyle" class="messageBox">
    <div class="userInfo">
      <img class="avatar" v-if="props.avatarUrl" :src="props.avatarUrl" />
      <h3 class="username" :style="userStyle">
        {{ props.username }}
      </h3>
    </div>
    <p class="message" v-html="parsedMessage"></p>
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
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.timeAgo {
  margin-top: 1.25rem;
  color: gray;
}
.avatar {
  width: 50px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.username {
  font-size: 1.75rem;
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
