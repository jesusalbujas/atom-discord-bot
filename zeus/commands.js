require('dotenv').config();

module.exports = {
  replybuenas: (message) => {
    const date = new Date();
    const timezone = new Date(date.toLocaleString('en-US', { timeZone: process.env.TIMEZONE }));
    const hour = timezone.getHours();
    let saludo;

    if (hour >= 6 && hour < 12) {
      saludo = 'Hola, Buenos días!';
    } else if (hour >= 12 && hour < 18) {
      saludo = 'Hola, Buenas tardes!';
    } else {
      saludo = 'Hola, Buenas noches!';
    }

    message.reply(`${saludo}`);
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