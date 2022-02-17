<script setup>
import moment from "moment";

moment.locale("de");

const props = defineProps({
  message: String,
  username: String,
  usernameColor: String,
  firstMsg: Boolean,
  timeSent: Number,
  actTime: Number,
});

// Username Color
const userStyle = `color: ${props.usernameColor}`;

// Box Color
let boxColor = `rgb(55, 11, 97);`;
if (props.firstMsg) boxColor = `rgb(97, 14, 11);`;

const boxStyle = `background-color: ${boxColor}`;
</script>

<template>
  <div :style="boxStyle" class="message">
    <h3 :style="userStyle">{{ props.username }}</h3>
    <p>{{ props.message }}</p>
    <p class="timeAgo">{{ moment(props.timeSent).fromNow() }}</p>
  </div>
</template>

<style scoped>
.message {
  width: 100%;
  border-radius: 10px;
  margin: 0.25rem 0rem 0.25rem 0rem;
  padding: 0.5rem;
}
.timeAgo {
  margin-top: 1rem;
  color: gray;
}
</style>
