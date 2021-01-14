const Logger = require("./Logger");
const logger = new Logger("StyleManager");

module.exports = class StyleManager {
  constructor() {
    this.StyleManagerElem = document.body.getElementsByTagName(
      "DiscordiumStyleManager"
    )[0];
    this.styles = new Map();
  }
  append(style) {
    try {
      this.styles.set(style.id, style);
      this.StyleManagerElem.append(style.elem);
      logger.info(`${style.path} installed.`);
    } catch (error) {
      logger.error(`Failed to append theme ${style.path} ${error}`);
    }
  }
};
