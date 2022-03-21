# twitch-chat-overlay

## Todos
- [x] Projekt initialisieren
- [x] Vue + Electron installieren
- [x] Chats anzeigen
- [x] Farben an neues Logo anpassen
- [x] Margin links, rechts, oben von message box entfernen
- [x] Electron Fenster anpassen (Hintergrund entfernen, Leiste entfernen)
- [x] Leere Nachricht wenn noch keine Nachrichten
- [x] Nette Transitions
- [x] Avatar anzeigen
- [x] Follower / Nicht Follower unterscheiden -> Farbe?
- [x] MArkup? -> Bold, Italic, Underline... dompurify
- [x] BTTV Emote Twitch Emotes
- [x] Gelöschte Nachrichten aus Array löschen (tmi.js event messagedeleted, https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#messagedeleted)
- [x] Badges anzeigen -> Streamer, Mods, Subs

## Future Todos

- [ ] eigene badges -> fontawesome icon
- [ ] Status Nachricht
- [ ] Hervorgehobene Nachricht hervorheben-
- [ ] Redemptions anzeigen
- [ ]
(- [ ] Sub / Spender anzeigen)
(- [ ] Seit wann Follower)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Preview with [Electron](https://www.electronjs.org/) (Build first!)

```sh
npm run electron:start
```

### Build Windows Exec. with [Electron](https://www.electronjs.org/) (Build first!)

```sh
npm run electron:windows
```
