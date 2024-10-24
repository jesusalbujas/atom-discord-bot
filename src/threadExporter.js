const writeXlsxFile = require('write-excel-file/node');
const fs = require('fs');
const permissions = require('./permissions'); // Importar el módulo de permisos
require('dotenv').config();

module.exports = async (message, type = 'both') => { // Añadir un parámetro type
  // Verificar permisos
  if (!permissions.hasRequiredRole(message)) {
    console.log('Error: User does not have the necessary permissions to execute this command.');
    return;
  }

  if (permissions.isCommandFromThread(message)) {
    console.log('Error: Cannot execute command from a thread.');
    return;
  }

  if (!permissions.isCommandInAllowedChannel(message)) {
    console.log(`Error: Command can only be executed from specified channels.`);
    return;
  }

  const channelsToCheck = permissions.getChannelsToCheck();
  console.log('Channels to Check:', channelsToCheck);

  const channels = await message.guild.channels.fetch();
  console.log('Channels obtained:', channels.map(c => ({ name: c.name, type: c.type })));

  for (const channel of channels.values()) {
    if ((channelsToCheck.includes('ALL') || channelsToCheck.includes(channel.name)) && channel.type === 0) {
      console.log(`Processing text channel: ${channel.name}`);

      const threads = [];

      try {
        const threadsCache = await channel.threads.fetch();
        console.log(`Threads obtained from the channel ${channel.name}:`, threadsCache.threads);

        for (const thread of threadsCache.threads.values()) {
          console.log(`Thread: ${thread.name}, Archived: ${thread.archived}, Type: ${thread.type}`);

          // Filtrar hilos según el tipo solicitado
          if ((type === 'open' && !thread.archived) || (type === 'closed' && thread.archived) || type === 'both') {
            threads.push({
              channel: channel.name,
              thread: thread.name,
              createdAt: thread.createdAt,
              archived: thread.archived
            });
          }
        }
      } catch (error) {
        console.error(`Error getting threads from ${channel.name}:`, error);
      }

      console.log('Collected threads:', threads);

      if (threads.length === 0) {
        console.log(`There are no threads in ${channel.name} to export.`);
        continue;
      }

      const data = [
        [
          { value: 'Cliente', fontWeight: 'bold' },
          { value: 'Nombre del Hilo', fontWeight: 'bold' },
          { value: 'Fecha Creación', fontWeight: 'bold' },
          { value: 'Estado', fontWeight: 'bold' }
        ],
        ...threads.map(thread => [
          { value: thread.channel },
          { value: thread.thread },
          { value: thread.createdAt.toLocaleString() },
          { value: thread.archived ? 'Cerrado' : 'Abierto' }
        ])
      ];

      console.log('Data to export:', data);

      const filePath = `./${channel.name.replace(/[^a-zA-Z0-9]/g, '_')}_hilos.xlsx`;
      await writeXlsxFile(data, {
        filePath: filePath
      });

      const channelsToReceive = process.env.CHANNEL_TO_RECEIVE
        ? process.env.CHANNEL_TO_RECEIVE.split(',').map(channel => channel.trim())
        : [message.channel.name];

      for (const receiveChannelName of channelsToReceive) {
        const receiveChannel = message.guild.channels.cache.find(ch => ch.name === receiveChannelName);
        if (receiveChannel) {
          await receiveChannel.send({ files: [{ attachment: filePath, name: `${channel.name}_hilos.xlsx` }] });
        } else {
          console.error(`Error: Channel to receive "${receiveChannelName}" not found.`);
        }
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        }
      });
    } else {
      console.log(`Skipping non-text or non-listed channel: ${channel.name}, type: ${channel.type}`);
    }
  }
};
