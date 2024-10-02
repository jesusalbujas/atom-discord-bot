require('dotenv').config();

module.exports = {
  replybuenas: (message) => {
    const date = new Date();
    const timezone = new Date(date.toLocaleString('en-US', { timeZone: process.env.TIMEZONE }));
    const hour = timezone.getHours();
    let greeting;

    if (hour >= 6 && hour < 12) {
      greeting = 'Hola, buenos días!';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Hola, buenas tardes!';
    } else {
      greeting = 'Hola, buenas noches!';
    }

    message.reply(`${greeting}`);
  }, // Este validador hace que si es mañana, tarde o noche responda dependiendo.
  getThreads: (message) => {
    require('./getThreads')(message); // Importar la función getThreads
  }
};
