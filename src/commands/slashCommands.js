// commands.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [
  {
    name: 'cerrar_hilo',
    description: 'Cierra un hilo especificando un motivo y un solicitante.',
    options: [
      {
        type: 6, // Tipo de opción: Usuario
        name: 'solicitante',
        description: 'El usuario que solicita cerrar el hilo.',
        required: true,
      },
      {
        type: 3, // Tipo de opción: String
        name: 'motivo',
        description: 'El motivo para cerrar el hilo.',
        required: true,
        choices: [
          { name: 'Ventas', value: 'ventas' },
          { name: 'Compras', value: 'compras' },
          { name: 'Órdenes de venta', value: 'ordenes_venta' },
        ],
      },
    ],
  },
];

const slashCommands = async () => {
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  slashCommands,
};
