export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten solicitudes POST' });
  }

  const { event, timestamp, context, properties } = req.body;

  // Validación básica
  if (!event || !timestamp || !context || !properties) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  try {
    const response = await fetch("https://business-api.tiktok.com/open_api/v1.2/pixel/track/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN
      },
      body: JSON.stringify({
        pixel_code: process.env.TIKTOK_PIXEL_ID,
        event,
        timestamp,
        context,
        properties
      })
    });

    const data = await response.json();

    // Validación de respuesta TikTok
    if (!response.ok) {
      return res.status(response.status).json({ error: 'TikTok API error', details: data });
    }

    res.status(200).json({ message: 'Evento enviado a TikTok', tiktokResponse: data });

  } catch (error) {
    console.error('Error al enviar evento:', error);
    res.status(500).json({ error: 'Fallo al enviar evento a TikTok' });
  }
}
