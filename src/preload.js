const { ipcRenderer, contextBridge } = require("electron");
const Logger = require("./Logger");
const Discordium = require("./Discordium");

contextBridge.exposeInMainWorld = () => void 0;

const originalPreload = ipcRenderer.sendSync("loader_get-original-preload");
if (originalPreload) {
  console.debug("[Discordium] - Running original preload.");
  require(originalPreload);
}

const StyleManagerElem = document.createElement("DiscordiumStyleManager");

const logger = new Logger("Preload");

async function instansiate() {
  try {
    const mainfestData = require("../manifest.json");
    document.body.prepend(StyleManagerElem);

    const settingsInfo = document.createElement("style");
    settingsInfo.setAttribute("id", `DiscordiumInfo-${Date.now()}`);
    settingsInfo.innerText = `
      .info-1VyQPT:after {
        content: "Discordium ${mainfestData.version} (${mainfestData.branch})";
        color: var(--text-muted);
        font-size: 12px;
        line-height: 16px;
      }
    `;
    document.body.prepend(settingsInfo);
    logger.info("Preload Successful.");

    const discordium = new Discordium();
    discordium.init();
    window.discordium = discordium;
    global.discordium = discordium;
  } catch (error) {
    logger.error(`Preload Failure: ${error}`);
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => {
    instansiate();
  });
} else {
  instansiate();
}
