<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import messageBox from "./components/messageBox.vue";

const client = new tmi.Client({ channels: ["codingtomato"] });
client.connect().catch(console.error);

let followerIntervall;
const messages = ref([]);
const actTime = ref(Date.now());
const users = ref(new Map());
const followers = ref(new Map());
const twitchApiHeaders = {
  headers: {
    "Client-Id": import.meta.env.VITE_CLIENT_ID,
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

client.on("message", async (channel, tags, message, self) => {
  const userId = tags["user-id"];
  if (!users.value.has(userId)) {
    const response = await fetch(
      `https://api.twitch.tv/helix/users?id=${userId}`,
      twitchApiHeaders
    );
    const json = await response.json();

    users.value.set(userId, {
      username: tags["display-name"],
      avatarUrl: json.data[0].profile_image_url,
    });
  }

  const userObj = users.value.get(userId);

  messages.value.unshift({
    id: tags["id"],
    username: tags["display-name"],
    message: message,
    usernameColor: tags["color"],
    firstMsg: tags["first-msg"],
    timeSent: Date.now(),
    avatarUrl: userObj.avatarUrl,
    actTime: actTime,
    emotes: tags["emotes"],
    emote_only: tags["emote-only"] || false,
    badges_raw: tags["badges-raw"],
  });
  // console.log(tags, message, users.value);
  // console.log(messages.value);
});

client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
  const deletedMessageID = userstate["target-msg-id"];
  const oldMessages = messages.value;

  messages.value = oldMessages.filter((m) => !(m.id === deletedMessageID));
});

const requestFollowers = async () => {
  const followerMap = new Map();

  const response = await fetch(
    "https://api.twitch.tv/helix/users/follows?to_id=64065403&first=100",
    twitchApiHeaders
  );

  const followers = await response.json();
  followers.data.forEach((f) => {
    followerMap.set(f.from_login, f.followed_at);
  });

  let nextPage = followers.pagination.cursor;
  while (nextPage) {
    const nextResponse = await fetch(
      `https://api.twitch.tv/helix/users/follows?to_id=64065403&first=100&after=${nextPage}`,
      twitchApiHeaders
    );
    const nextFollowers = await nextResponse.json();
    nextFollowers.data.forEach((f) => {
      followerMap.set(f.from_login, f.followed_at);
    });

    nextPage = nextFollowers.pagination.cursor;
  }

  return followerMap;
};

setInterval(() => {
  actTime.value = Date.now();
}, 1000 * 10);

onMounted(async () => {
  followers.value = await requestFollowers();

  followerIntervall = setInterval(async () => {
    followers.value = await requestFollowers();
  }, 1000 * 60 * 5);
});

onUnmounted(() => {
  clearInterval(followerIntervall);
});
</script>

<template>
  <div class="content" v-if="!messages.length">
    <messageBox
      message="Noch keine Nachrichten vorhanden!"
      username="Keine Nachrichten"
      usernameColor="red"
      :firstMsg="true"
    />
  </div>
  <div class="content" v-if="messages.length">
    <messageBox
      v-for="m in messages"
      :key="m.id"
      :message="m.message"
      :username="m.username"
      :usernameColor="m.usernameColor"
      :firstMsg="m.firstMsg"
      :timeSent="m.timeSent"
      :actTime="m.actTime"
      :avatarUrl="m.avatarUrl"
      :isFollower="followers.has(m.username.toLowerCase())"
      :emotes="m.emotes"
      :emote_only="m.emote_only"
      :badges_raw="m.badges_raw"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Source Sans Pro", sans-serif;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*::-webkit-scrollbar {
  display: none;
}
.content {
  width: 100vw;
  height: 100vh;
  margin: 0;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0;
}
</style>
