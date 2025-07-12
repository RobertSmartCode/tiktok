// Solución: el error dice que tu archivo se está tratando como ES module, pero estás usando `require()` que es CommonJS.

// Tienes dos opciones rápidas:

// OPCIÓN 1: Cambiar el archivo a CommonJS
// 1. En tu package.json elimina "type": "module" si existe.
// 2. O renombra tu archivo index.js a index.cjs

// OPCIÓN 2: Mantener ESM y usar "import"
// En lugar de require, usa:

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

app.use(express.json());

app.post('/api/tiktok-event', (req, res) => {
  const { event, value } = req.body;
  console.log('📩 Evento recibido:', event, value);

  // Aquí iría la lógica para enviar a TikTok
  res.status(200).json({ success: true, message: 'Evento recibido' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
