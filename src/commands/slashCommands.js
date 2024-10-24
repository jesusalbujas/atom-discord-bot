// commands.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [
  {
    name: 'cerrar_hilo',
    description: 'Cierra un hilo especificando características.',
    options: [
      {
        type: 6, // Tipo de opción: Usuario
        name: 'solicitante',
        description: 'El usuario que solicita crear el hilo.',
        required: true,
      },
      {
        type: 3, // Tipo de opción: String
        name: 'topico',
        description: 'El topico del hilo.',
        required: true,
        choices: [
          { name: 'Ventas', value: 'ventas' },
          { name: 'Cuentas por Pagar Nacional', value: 'cuentas_por_pagar_nacional' },
          { name: 'Órdenes de venta', value: 'ordenes_venta' },
          { name: 'Cobranza', value: 'cobranza'},
          { name: 'Finanzas', value: 'finanzas'},
          { name: 'Gerencia', value: 'gerencia'},
          { name: 'Contabilidad', value: 'contabilidad'},
          { name: 'General', value: 'general'},
          { name: 'Cuentas por pagar Importación', value: 'cuentas_por_pagar_importacion'},
          { name: 'Almacén e Inventario', value: 'almacen_inventario'},
          { name: 'Compra Nacional', value: 'compra_nacional'},
          { name: 'Compra Importación', value: 'compra_importacion'},
          { name: 'Tributos', value: 'tributos'},
          { name: 'Cuentas por Cobrar', value: 'cuentas_por_cobrar'},
          { name: 'Facturación', value: 'facturacion'},
          { name: 'Tesoreria', value: 'tesoreria'},
          { name: 'Producción', value: 'produccion'},
          { name: 'Costos', value: 'costos'},
          { name: 'Fuerza Móvil', value: 'fuerza_movil'},
          { name: 'Control de Calidad', value: 'control_de_calidad'},
          { name: 'Informática', value: 'informatica'}
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
