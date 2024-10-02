const { Client, Events } = require('discord.js');
const { ready, clientReady } = require('./events');
const commands = require('./commands');
require('dotenv').config();

const client = new Client({ 
  intents: 3276799 // permiso a todo
});

client.once('ready', async () => {
  await clientReady(client); // esperar que el cliente este listo / Await the clientReady function
  ready();
});

// Comandos
client.on('messageCreate', (message) => {

  if (message.author.bot) return; // El bot no se responderá a si mismo / Prevent the bot from responding to its own messages

  if (message.content.toLowerCase().includes('buenas')) {
    commands.replybuenas(message); // Si alguien dice cualquier frase que incluya buenas el bot responderá.
  }
  if (message.content.toLowerCase().includes('hilos abiertos')) {
    commands.getThreads(message); // Obtener los hilos abiertos
  }
});

client.login(process.env.DISCORD_TOKEN);