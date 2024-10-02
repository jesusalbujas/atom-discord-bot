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

// events.js

const { Events } = require('discord.js');

module.exports = {
  clientReady: async (client) => {
    console.log(`Connected is ${client.user.username}!`);
    console.log(`The ${client.user.username} bot is eager to get started!`);
    
    // Inicializar el manejo de errores
    initializeErrorHandling(client);
  }
};

// Función para manejar errores
const initializeErrorHandling = (client) => {
  client.on('error', (error) => {
    console.error('An error occurred:', error);
  });

  // Manejar errores en eventos específicos
  client.on('warn', (info) => {
    console.warn('Warning:', info);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
};
