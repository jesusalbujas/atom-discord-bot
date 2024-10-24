// permissions.js
require('dotenv').config();

module.exports = {
// Verificar si el autor del mensaje tiene los roles permitidos
hasRequiredRole: (message) => {
  const rolesToAllow = process.env.ROLES_TO_ALLOW
    ? process.env.ROLES_TO_ALLOW.split(',').map(role => role.trim())
    : [];

  // Si no hay roles definidos, permite que todos los usuarios usen el comando
  if (rolesToAllow.length === 0) {
    return true; // Permitir todos los usuarios
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  return message.member.roles.cache.some(role => rolesToAllow.includes(role.name));
},

  // Verificar si el comando se ejecuta en uno de los canales permitidos
  isCommandInAllowedChannel: (message) => {
    const channelsToSend = process.env.CHANNEL_TO_SEND
      ? process.env.CHANNEL_TO_SEND.split(',').map(channel => channel.trim())
      : [];

    return channelsToSend.includes(message.channel.name);
  },

  // Verificar si el comando se ejecuta desde un hilo
  isCommandFromThread: (message) => {
    return message.channel.isThread();
  },

  // Verificar los canales desde los cuales se puede ejecutar el comando
  getChannelsToCheck: () => {
    return process.env.CHANNELS_TO_CHECK
      ? process.env.CHANNELS_TO_CHECK.split(',').map(channel => channel.trim())
      : ['ALL'];
  }
};
