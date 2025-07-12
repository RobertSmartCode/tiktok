// /api/tiktok-event.js
export default async function handler(req, res) {
  console.log("🔵 Solicitud recibida");

  if (req.method !== 'POST') {
    console.warn("🟡 Método no permitido: ", req.method);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { event, timestamp, context, properties } = req.body;
  console.log("🧩 Datos recibidos:", req.body);

  if (!event || !timestamp || !context || !properties) {
    console.error("🔴 Datos faltantes");
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  try {
    const tiktokURL = "https://business-api.tiktok.com/open_api/v1.2/pixel/track/";
    const body = {
      pixel_code: process.env.TIKTOK_PIXEL_ID,
      event,
      timestamp,
      context,
      properties
    };

    console.log("📤 Enviando a TikTok:", body);

    const response = await fetch(tiktokURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("📩 Respuesta TikTok:", data);

    if (!response.ok) {
      console.error("❌ Error en respuesta TikTok:", response.status, data);
      return res.status(response.status).json({ error: 'TikTok API error', details: data });
    }

    res.status(200).json({ message: 'Evento enviado a TikTok', tiktokResponse: data });
  } catch (error) {
    console.error("🔥 Error inesperado:", error);
    res.status(500).json({ error: 'Fallo al enviar evento a TikTok' });
  }
}
