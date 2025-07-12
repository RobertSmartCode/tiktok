export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten solicitudes POST' });
  }

  const { pixel_code, event, timestamp, context, properties } = req.body;

  try {
    const response = await fetch('https://business-api.tiktok.com/open_api/v1.2/pixel/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN
      },
      body: JSON.stringify({
        pixel_code,
        event,
        timestamp,
        context,
        properties
      })
    });

    const data = await response.json();
    res.status(200).json({ message: 'Evento enviado a TikTok', tiktokResponse: data });

  } catch (error) {
    console.error('Error al enviar evento:', error);
    res.status(500).json({ error: 'Fallo al enviar evento a TikTok' });
  }
}
