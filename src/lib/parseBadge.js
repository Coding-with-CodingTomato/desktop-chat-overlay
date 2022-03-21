const badgesMap = new Map();
let badgesHTML;

const twitchApiHeaders = {
  headers: {
    "Client-Id": import.meta.env.VITE_CLIENT_ID,
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

const getGlobalBadges = async () => {
  const response = await fetch(
    "https://api.twitch.tv/helix/chat/badges/global",
    twitchApiHeaders
  );

  const json = await response.json();
  json.data.forEach((badge) => {
    const setId = badge.set_id;
    badge.versions.forEach((badgeVersion) => {
      badgesMap.set(`${setId}/${badgeVersion.id}`, badgeVersion.image_url_4x);
    });
  });
};

const getChannelBadges = async () => {
  const response = await fetch(
    "https://api.twitch.tv/helix/chat/badges?broadcaster_id=64065403",
    twitchApiHeaders
  );

  const json = await response.json();
  json.data.forEach((badge) => {
    const setId = badge.set_id;
    badge.versions.forEach((badgeVersion) => {
      badgesMap.set(`${setId}/${badgeVersion.id}`, badgeVersion.image_url_4x);
    });
  });
};

const getAllBadges = async () => {
  if (Array.from(badgesMap.keys()).length === 0) {
    console.log("Getting Badges from API");
    await getGlobalBadges();
    await getChannelBadges();
  }
};

export const parseBadges = async (badges_raw) => {
  await getAllBadges();
  if (!badges_raw) return "";

  const toDisplayBadges = badges_raw.split(",");
  badgesHTML = "";

  await toDisplayBadges.forEach((b) => {
    const badgeUrl = badgesMap.get(b);
    badgesHTML += `<img src="${badgeUrl}" style="width: 30px" />`;
  });

  return badgesHTML;
};

export default parseBadges;
