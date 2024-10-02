/* 
  Atom (Discord Bot) for Managing Discord Interactions
  Copyright (C) 2024 Jesús Albujas [jesusramirez35000@gmail.com] 
  This program is free software: you can redistribute it and/or modify
  it under the terms of the MIT License. 

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

  For more details, please refer to the MIT License.

  You should have received a copy of the MIT License
  along with this program. If not, see <https://opensource.org/licenses/MIT>.
*/

const writeXlsxFile = require('write-excel-file/node');
const fs = require('fs');
require('dotenv').config();

module.exports = async (message) => {
  // Obtener los roles permitidos de la variable de entorno
  const rolesToAllow = process.env.ROLES_TO_ALLOW
    ? process.env.ROLES_TO_ALLOW.split(',').map(role => role.trim())
    : [];

  // Verificar si el autor tiene alguno de los roles permitidos (si no se especifican roles, permite todos)
  const hasRole = rolesToAllow.length === 0 || message.member.roles.cache.some(role => rolesToAllow.includes(role.name));

  // Si no tiene el rol, detener la ejecución
  if (!hasRole) {
    console.log('Error: User does not have the necessary permissions to execute this command.');
    return;
  }

  // Validar que no se esté ejecutando desde un hilo
  if (message.channel.isThread()) {
    console.log('Error: Cannot execute command from a thread.');
    return;
  }

  // Obtener los canales desde los cuales se permite ejecutar el comando
  const channelsToSend = process.env.CHANNEL_TO_SEND
    ? process.env.CHANNEL_TO_SEND.split(',').map(channel => channel.trim())
    : [];

  // Si no se especifican canales para ejecutar el comando, no se ejecuta en ningún canal
  if (channelsToSend.length === 0) {
    console.log('Error: No channels specified for executing the command.');
    return;
  }

  // Validar que el comando se ejecute desde uno de los canales permitidos
  if (!channelsToSend.includes(message.channel.name)) {
    console.log(`Error: Command can only be executed from one of these channels: ${channelsToSend.join(', ')}`);
    return;
  }

  // Obtener los canales permitidos para revisar hilos (si no se especifican, revisa todos los canales)
  const channelsToCheck = process.env.CHANNELS_TO_CHECK
    ? process.env.CHANNELS_TO_CHECK.split(',').map(channel => channel.trim())
    : ['ALL'];

  console.log('Channels to Check:', channelsToCheck);

  const channels = await message.guild.channels.fetch();
  console.log('Channels obtained:', channels.map(c => ({ name: c.name, type: c.type })));

  for (const channel of channels.values()) {
    // Revisar todos los canales si no se especifican, o revisar solo los especificados
    if ((channelsToCheck.includes('ALL') || channelsToCheck.includes(channel.name)) && channel.type === 0) {
      console.log(`Processing text channel: ${channel.name}`);

      const threads = [];

      try {
        const threadsCache = await channel.threads.fetch();
        console.log(`Threads obtained from the channel ${channel.name}:`, threadsCache.threads);

        for (const thread of threadsCache.threads.values()) {
          console.log(`Thread: ${thread.name}, Archived: ${thread.archived}, Type: ${thread.type}`);
          if (!thread.archived) {
            threads.push({
              channel: channel.name,
              thread: thread.name,
              createdAt: thread.createdAt
            });
          }
        }
      } catch (error) {
        console.error(`Error getting threads from ${channel.name}:`, error);
      }

      console.log('Collected threads:', threads);

      if (threads.length === 0) {
        console.log(`There are no open threads in ${channel.name} to export.`);
        continue;
      }

      const data = [
        [
          { value: 'Cliente', fontWeight: 'bold' },
          { value: 'Nombre del Hilo', fontWeight: 'bold' },
          { value: 'Fecha Creación', fontWeight: 'bold' }
        ],
        ...threads.map(thread => [
          { value: thread.channel },
          { value: thread.thread },
          { value: thread.createdAt.toLocaleString() }
        ])
      ];

      console.log('Data to export:', data);

      const filePath = `./${channel.name.replace(/[^a-zA-Z0-9]/g, '_')}_hilos_abiertos.xlsx`;
      await writeXlsxFile(data, {
        filePath: filePath
      });

      // Obtener los canales a los cuales se enviará el archivo
      const channelsToReceive = process.env.CHANNEL_TO_RECEIVE
        ? process.env.CHANNEL_TO_RECEIVE.split(',').map(channel => channel.trim())
        : [message.channel.name]; // Si no se especifica, enviar al canal donde se ejecutó el comando

      // Enviar el archivo a los canales permitidos
      for (const receiveChannelName of channelsToReceive) {
        const receiveChannel = message.guild.channels.cache.find(ch => ch.name === receiveChannelName);
        if (receiveChannel) {
          await receiveChannel.send({ files: [{ attachment: filePath, name: `${channel.name}_hilos_abiertos.xlsx` }] });
        } else {
          console.error(`Error: Channel to receive "${receiveChannelName}" not found.`);
        }
      }

      // Eliminar el archivo después de enviarlo
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
