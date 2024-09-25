const { Events } = require('discord.js');

module.exports = {
  clientReady: async (client) => {
    console.log(`Connect is ${client.user.username}!`);
  },
  ready: () => {
    console.log('The Discord Bot is Ready!');
  }
};