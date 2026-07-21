const fs = require('fs');
const path = require('path');

// Un píxel rojo básico en formato Base64 para que el navegador deje de lanzar el error 404
const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(base64Data, 'base64');

fs.writeFileSync(path.join(__dirname, 'public', 'icon-192x192.png'), buffer);
fs.writeFileSync(path.join(__dirname, 'public', 'icon-512x512.png'), buffer);

console.log('PNGs generados correctamente.');
