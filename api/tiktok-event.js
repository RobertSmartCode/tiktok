export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  console.log('[INFO] Evento recibido');
  console.log('[DEBUG] Body:', req.body);

  try {
    const pixelCode = process.env.TIKTOK_PIXEL_ID;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

    if (!pixelCode || !accessToken) {
      return res.status(500).json({ error: 'Faltan variables de entorno' });
    }

    // Simulamos envío de evento (aquí puedes poner fetch real si quieres)
    console.log('[ENV] Pixel:', pixelCode);
    console.log('[ENV] Token:', accessToken);

    return res.status(200).json({ message: 'Evento enviado', pixelCode });

  } catch (error) {
    console.error('[ERROR]', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
