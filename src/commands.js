require('dotenv').config();

module.exports = {
  replybuenas: (message) => {
    const date = new Date();
    const timezone = new Date(date.toLocaleString('en-US', { timeZone: process.env.TIMEZONE }));
    const hour = timezone.getHours();
    let greeting;

    if (hour >= 6 && hour < 12) {
      greeting = 'Hola, Buenos días!';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Hola, Buenas tardes!';
    } else {
      greeting = 'Hola, Buenas noches!';
    }

    message.reply(`${greeting}`);
  }, // Este validador hace que si es mañana, tarde o noche responda dependiendo.
  hello: (message) => {
    message.reply('Hello World~!');
  },
  testbot: (message) => {
    message.reply("Queloque");
  },
  ping: (message) => {
    message.reply('Pong~!');
  }
};