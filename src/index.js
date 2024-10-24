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

const { Client } = require('discord.js');
const { clientReady } = require('./events/events');
const { slashCommands } = require('./commands/slashCommands'); // Importar el registro de comandos
const slashCommandListener = require('./commands/slashCommandListener');
require('dotenv').config();

const client = new Client({ intents: 3276799 });

client.once('ready', async () => {
  await clientReady(client);
  await slashCommands(); // Registrar comandos slash (/)
  slashCommandListener(client);
});

client.login(process.env.DISCORD_TOKEN);
