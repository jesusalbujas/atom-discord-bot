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

require('dotenv').config();

module.exports = {
/* Responde con un saludo apropiado según la hora del día.
   Respond with a greeting appropriate for the time of day.
*/
  replybuenas: (message) => {
    const date = new Date();
    const timezone = new Date(date.toLocaleString('en-US', { timeZone: process.env.TIMEZONE }));
    const hour = timezone.getHours();
    let greeting;

/* Determina el saludo basado en la hora del día.
   Determine the greeting based on the time of day
*/
    if (hour >= 6 && hour < 12) {
      greeting = 'Hola, buenos días!';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Hola, buenas tardes!';
    } else {
      greeting = 'Hola, buenas noches!';
    }
    message.reply(`${greeting}`);
  }, 
  
  getThreads: (message) => {
    require('./threadExporter')(message);
  }
};
