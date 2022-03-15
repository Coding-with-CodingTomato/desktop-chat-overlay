const allEmotesMap = new Map();
let regexStr = "";
let emoteRegex;
let lastRequest;
const emoteTimeout = 24 * 60 * 60 * 1000;

const getBTTVEmotes = async () => {
  const responseGlob = await fetch(
    "https://api.betterttv.net/3/cached/emotes/global"
  );
  const responseUser = await fetch(
    "https://api.betterttv.net/3/cached/users/twitch/64065403"
  );

  const globalEmotes = await responseGlob.json();
  const { channelEmotes, sharedEmotes } = await responseUser.json();

  globalEmotes.forEach((e) => {
    allEmotesMap.set(e.code.toLowerCase(), {
      id: e.id,
      url: `https://cdn.betterttv.net/emote/${e.id}/3x`,
    });
    regexStr += `${e.code
      .toLowerCase()
      .replace(/\(/, "\\(")
      .replace(/\)/, "\\)")}|`;
  });

  channelEmotes.forEach((e) => {
    allEmotesMap.set(e.code.toLowerCase(), {
      id: e.id,
      url: `https://cdn.betterttv.net/emote/${e.id}/3x`,
    });

    regexStr += `${e.code
      .toLowerCase()
      .replace(/\(/, "\\(")
      .replace(/\)/, "\\)")}|`;
  });

  sharedEmotes.forEach((e) => {
    allEmotesMap.set(e.code.toLowerCase(), {
      id: e.id,
      url: `https://cdn.betterttv.net/emote/${e.id}/3x`,
    });

    regexStr += `${e.code
      .toLowerCase()
      .replace(/\(/, "\\(")
      .replace(/\)/, "\\)")}|`;
  });
};
const getFFZEmotes = async () => {
  const responseGlobal = await fetch(
    "https://api.frankerfacez.com/v1/set/global"
  );
  const responseChannel = await fetch(
    "https://api.frankerfacez.com/v1/room/id/64065403"
  );

  const ffzGlobal = await responseGlobal.json();
  const ffzChannel = await responseChannel.json();

  ffzGlobal.sets["3"].emoticons.forEach((e) => {
    allEmotesMap.set(e.name.toLowerCase(), {
      id: e.id,
      url: `https://cdn.frankerfacez.com/emote/${e.id}/2`,
    });

    regexStr += `${e.name
      .toLowerCase()
      .replace(/\(/, "\\(")
      .replace(/\)/, "\\)")}|`;
  });

  ffzChannel.sets["1342102"].emoticons.forEach((e) => {
    allEmotesMap.set(e.name.toLowerCase(), {
      id: e.id,
      url: `https://cdn.frankerfacez.com/emote/${e.id}/2`,
    });

    regexStr += `${e.name
      .toLowerCase()
      .replace(/\(/, "\\(")
      .replace(/\)/, "\\)")}|`;
  });
};

const getEmoteRegex = async () => {
  if (!emoteRegex || (lastRequest && lastRequest > Date.now - emoteTimeout)) {
    console.log("Refreshing BTTV and FFZ cache...");

    await getBTTVEmotes();
    await getFFZEmotes();

    lastRequest = Date.now();
    regexStr = regexStr.slice(0, -1);
    emoteRegex = new RegExp(`(?<=^|\\s)(${regexStr})(?=$|\\s)`, "gi");
  }

  return emoteRegex;
};

export const parseEmotes = async (message, messageEmotes, emoteWidthPx) => {
  await getEmoteRegex();

  let parsedMessage = "";
  if (messageEmotes) {
    const emoteIds = Object.keys(messageEmotes);
    const emoteStart = emoteIds.reduce((starts, id) => {
      messageEmotes[id].forEach((startEnd) => {
        const [start, end] = startEnd.split("-");
        starts[start] = {
          url: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/4.0#emote" style="width: ${emoteWidthPx}px;" />`,
          end,
        };
      });
      return starts;
    }, {});

    const parts = Array.from(message);
    for (let i = 0; i < parts.length; i++) {
      const char = parts[i];
      const emoteInfo = emoteStart[i];
      if (emoteInfo) {
        parsedMessage += emoteInfo.url;
        i = emoteInfo.end;
      } else {
        parsedMessage += char;
      }
    }
  }

  const result = await (parsedMessage || message).replace(
    emoteRegex,
    (code) =>
      `<img src="${
        allEmotesMap.get(code.toLowerCase()).url
      }#emote" style="width: ${emoteWidthPx}px;" />`
  );

  return result;
};

export default parseEmotes;
