const messageResponses = require('../messageResponses');
const permissions = require('../permissions'); // Si tienes un archivo que maneja permisos

const slashCommandListener = (client) => {
  // Manejar mensajes de texto normales
  // client.on('messageCreate', (message) => {
  //   if (message.author.bot) return;

  //   // Responder a saludos
  //   if (message.content.toLowerCase().includes('buenas') || message.content.toLowerCase().includes('hola')) {
  //     messageResponses.replybuenas(message);
  //   }
  // });

  // Manejar comandos slash
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'cerrar_hilo') {
      const solicitante = options.getUser('solicitante');
      const motivo = options.getString('motivo');

      // Verificar roles (si es necesario)
      if (!permissions.hasRequiredRole(interaction)) {
        return await interaction.reply({
          content: 'No tienes permisos suficientes ejecutar este comando.',
          ephemeral: true, // Mensaje efímero
        });
      }

      // Verificar si el canal está dentro del permitido.
      if (!permissions.isCommandInAllowedChannel(interaction)) {
        return await interaction.reply({
          content: 'Este canal no tiene permisos suficientes para ejecutar este comando.',
          ephemeral: true // Mensaje efímero
        })
      }
      
      // Verificar si el comando se ejecuta desde un hilo
      if (!interaction.channel.isThread()) {
        await interaction.reply({
          content: 'Este comando debe ser ejecutado desde un hilo.',
          ephemeral: true, // Mensaje efímero
        });
        return;
      }

      // Cerrar el hilo
      await interaction.channel.setArchived(true);
      await interaction.reply({
        content: `Hilo cerrado por ${solicitante.username} por el motivo: ${motivo}`,
        ephemeral: true, // Mensaje efímero
      });
    }
  });
};

module.exports = slashCommandListener;
