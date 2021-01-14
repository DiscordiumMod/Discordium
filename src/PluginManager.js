const Logger = require("./Logger");
const logger = new Logger("PluginManager");

module.exports = class PluginManager {
  constructor(Discordium) {
    this.Discordium = Discordium;
    this.plugins = new Map();
  }

  addPlugin(plugin) {
    try {
      this.plugins.set(plugin.id, plugin);
      logger.info(`${plugin.path} installed.`);
      plugin.run(this.Discordium);
    } catch (error) {
      logger.error(`Falled to add plugin ${plugin.path} ${error}`);
    }
  }
};
