export default async function handler(req, res) {
  console.log("🔵 Nueva solicitud recibida");

  if (req.method !== 'POST') {
    console.warn("⚠️ Método no permitido:", req.method);
    return res.status(405).json({ error: 'Solo se acepta POST' });
  }

  const { event, timestamp, context, properties } = req.body;

  console.log("🧩 Datos recibidos:", { event, timestamp, context, properties });

  if (!event || !timestamp || !context || !properties) {
    console.error("❌ Datos faltantes en la solicitud");
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  try {
    console.log("📤 Enviando a TikTok API...");

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

    console.log("📩 Respuesta de TikTok API:", data);

    if (!response.ok) {
      console.error("❌ Error en respuesta de TikTok:", response.status, data);
      return res.status(response.status).json({ error: 'TikTok API error', details: data });
    }

    console.log("✅ Evento enviado correctamente");
    res.status(200).json({ message: 'Evento enviado a TikTok', tiktokResponse: data });

  } catch (error) {
    console.error("🔥 Error al conectar con TikTok:", error);
    res.status(500).json({ error: 'Fallo al enviar evento a TikTok', details: error.message });
  }
}
