module.exports = class Logger {
  constructor(name) {
    this.name = name;
  }

  _formatMessage(message, { color }) {
    if (color) {
      return `%c[Discordium:${this.name}]%c - ${message}`;
    } else return `[Discordium:${this.name}] - ${message}`;
  }
  log(level, message, ...args) {
    if (!level.startsWith("_") && this[level]) {
      return this[level](message, ...args);
    }
  }
  info(message) {
    console.log(
      this._formatMessage(message, { color: true }),
      "color: cornflowerblue;",
      ""
    );
  }
  error(message) {
    console.error(
      this._formatMessage(message, { color: true }),
      "color: red;",
      ""
    );
  }
  warn(message) {
    console.warn(
      this._formatMessage(message, { color: true }),
      "color: yellow;",
      ""
    );
  }
  debug(message, ...args) {
    console.log(this._formatMessage(message, { color: false }), ...args);
  }
};
