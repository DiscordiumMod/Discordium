const { remote } = require("electron");
const { readdir, readFile } = require("fs/promises");
const { resolve } = require("path");

const StyleManager = require("./StyleManager");
const PluginManager = require("./PluginManager");
const Logger = require("./Logger");

module.exports = class Discordium {
  constructor() {
    this.logger = new Logger("Base");
    this.stylesDir = resolve(__dirname, "../styles/");
    this.pluginDir = resolve(__dirname, "../plugins/");
    this.StyleManager = new StyleManager();
    this.PluginManager = new PluginManager(this);

    remote
      .getCurrentWebContents()
      .on("dom-ready", () => this.logger.info("Initializing"));
  }

  getLogger(name) {
    return new Logger(name);
  }

  async loadStyles() {
    try {
      const files = await readdir(this.stylesDir);
      files
        .filter((file) => file.endsWith(".css"))
        .forEach(async (file, id) => {
          const filePath = resolve(this.stylesDir, file);
          await this.loadStyle(filePath, id);
        });
    } catch (error) {
      this.logger.error(`Failed to load themes. ${error}`);
    }
  }
  async loadStyle(path, id) {
    try {
      const styleElem = document.createElement("style");
      styleElem.setAttribute("data-index", id);
      const css = await readFile(path, "utf8");
      styleElem.textContent = css;
      this.StyleManager.append({ path, id, elem: styleElem });
    } catch (error) {
      this.logger.error(`${path} failed to load. ${error}`);
    }
  }

  async loadPlugins() {
    try {
      const files = await readdir(this.pluginDir);
      files
        .filter((file) => file.endsWith(".js"))
        .forEach(async (file, id) => {
          const filePath = resolve(this.pluginDir, file);
          await this.loadPlugin(filePath, id);
        });
    } catch (error) {
      this.logger.error(`Failed to load plugins. ${error}`);
    }
  }
  async loadPlugin(path, id) {
    this.PluginManager.addPlugin({ path, id, run: require(path) });
  }

  async init() {
    try {
      await Promise.all([this.loadStyles(), this.loadPlugins()]);
      this.logger.info("Successfully Initialized.");
    } catch (error) {
      this.logger.error(`Failed to Initialize. ${error}`);
    }
  }
};
