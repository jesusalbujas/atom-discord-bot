// messageHandler.js

const messageResponses = require('./messageResponses');

const handleMessages = (client) => {
  client.on('messageCreate', (message) => {
    if (message.author.bot) return; // El bot no se responderá a si mismo

    if (message.content.toLowerCase().includes('buenas')) {
      messageResponses.replybuenas(message); // Responder a saludos
    }
    if (message.content.toLowerCase().includes('hilos abiertos')) {
      messageResponses.threadExporter(message); // Obtener los hilos abiertos
    }
  });
};

module.exports = handleMessages;
