const writeXlsxFile = require('write-excel-file/node');
const fs = require('fs'); // Importar el módulo fs

module.exports = async (message) => {
  // Obtener los canales del servidor
  const channels = await message.guild.channels.fetch();
  console.log('Canales obtenidos:', channels.map(c => ({ name: c.name, type: c.type }))); // Mostrar los nombres y tipos de canales
  
  const threads = [];

  // Iterar sobre cada canal de manera asincrónica
  for (const channel of channels.values()) {
    if (channel.type === 0) { // Solo procesar canales de texto (type === 0)
      console.log(`Procesando canal de texto: ${channel.name}`);

      try {
        // Obtener los hilos del canal
        const threadsCache = await channel.threads.fetch();
        console.log(`Hilos obtenidos del canal ${channel.name}:`, threadsCache.threads);

        // Iterar sobre los hilos
        for (const thread of threadsCache.threads.values()) {
          console.log(`Hilo: ${thread.name}, Archivado: ${thread.archived}`);
          // Filtrar hilos no archivados
          if (!thread.archived) {
            threads.push({
              channel: channel.name,
              thread: thread.name, // Solo almacenar el nombre del hilo
              createdAt: thread.createdAt // Almacenar la fecha de creación del hilo
            });
          }
        }
      } catch (error) {
        console.error(`Error al obtener los hilos de ${channel.name}:`, error);
      }
    } else {
      console.log(`Saltando canal que no es de texto: ${channel.name}, tipo: ${channel.type}`);
    }
  }

  console.log('Hilos recolectados:', threads);

  // Crear el archivo de Excel solo si hay datos
  if (threads.length === 0) {
    console.log('No hay hilos abiertos para exportar.');
    return message.channel.send('No hay hilos abiertos para exportar.');
  }

  // Crear el archivo de Excel
  const data = [
    // Títulos de las columnas
    [
      { value: 'Canal', fontWeight: 'bold' },
      { value: 'Hilo', fontWeight: 'bold' },
      { value: 'Fecha Creación', fontWeight: 'bold' }
    ],
    // Filas de datos
    ...threads.map(thread => [
      { value: thread.channel },
      { value: thread.thread },
      { value: thread.createdAt.toLocaleString() } // Formato de fecha y hora
    ])
  ];

  // Verificar que se están creando filas de datos
  console.log('Datos a exportar:', data);

  // Guardar el archivo de Excel
  const filePath = './hilos_abiertos.xlsx';
  await writeXlsxFile(data, {
    filePath: filePath
  });

  // Enviar el archivo de Excel al canal de Discord
  const sentMessage = await message.channel.send({ files: [{ attachment: filePath, name: 'hilos_abiertos.xlsx' }] });

  // Eliminar el archivo después de enviarlo
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error al eliminar el archivo: ${err}`);
    }
  });
};
