const path = require("path");
const electron = require("electron");
const Module = require("module");

const DiscordiumBootstrap = {
  _preload: undefined,
  preload: path.join(__dirname, "./src/preload.js"),
  manifest: require("./manifest.json"),
};

class BrowserWindow extends electron.BrowserWindow {
  constructor(opts) {
    if (
      !opts ||
      !opts.webPreferences ||
      !opts.webPreferences.preload ||
      !opts.title
    )
      return super(opts);

    DiscordiumBootstrap._preload = opts.webPreferences.preload;
    opts.webPreferences.nodeIntegration = true;
    opts.webPreferences.enableRemoteModule = true;
    opts.webPreferences.contextIsolation = false;
    opts.webPreferences.sandbox = false;
    opts.webPreferences.preload = DiscordiumBootstrap.preload;

    super(opts);
  }
}

Object.assign(BrowserWindow, electron.BrowserWindow);

electron.ipcMain.on("loader_get-original-preload", (ev) => {
  ev.returnValue = DiscordiumBootstrap._preload;
});

electron.ipcMain.on("Discordium-getBootstrap", (ev) => {
  ev.returnValue = DiscordiumBootstrap;
});

function onReady() {
  Object.assign(BrowserWindow, electron.BrowserWindow);

  const electronPath = require.resolve("electron");
  const electronExports = Object.assign({}, electron, { BrowserWindow });

  require.cache[electronPath].exports = electronExports;

  if (require.cache[electronPath].exports !== electronExports) {
    delete require.cache[electronPath].exports;
    require.cache[electronPath].exports = electronExports;
  }
}

const { filename } = module.parent;

if (filename.includes("discord_desktop_core")) {
  onReady();
} else {
  const discordPath = path.join(path.dirname(filename), "../app.asar");
  const discordPkg = require(path.join(discordPath, "./package.json"));

  electron.app.setAppPath(discordPath);
  electron.app.name = discordPkg.name;

  electron.app.once("ready", onReady);

  Module._load(path.join(discordPath, discordPkg.main), null, true);
}
