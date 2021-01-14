const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld = () => void 0;

const originalPreload = ipcRenderer.sendSync("loader_get-original-preload");
if (originalPreload) {
  console.debug("[Discordium] - Running original preload.");
  require(originalPreload);
}
