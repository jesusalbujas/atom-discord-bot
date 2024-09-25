const { Client, Events } = require('discord.js');

require('dotenv').config();

// Cantidad de Permisos
const client = new Client({ 
  intents: 3276799 // permiso a todo
});

// Eventos
client.on(Events.ClientReady, async () => {
    console.log(`Connect is ${client.user.username}!`) // cuando este conectado indique el nombre del bot
})

// Mensaje para saber que el bot está listo
client.once('ready', () => {
  console.log('The Discord Bot is Ready!');
});

// respuestas a mensajes
client.on('messageCreate', message => {
  if (message.content.toLowerCase() === 'hello') {
    message.reply('Hello World~!');
  }
  if (message.content.toLowerCase() === 'testbot') {
    message.reply("Hi! I'm up and Running~!");
  }
  if (message.content.toLowerCase() === 'ping') {
    message.reply('Pong~!');
  } 
});

client.login(process.env.DISCORD_TOKEN);