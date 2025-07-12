// Archivo: api/tiktok-event.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const PIXEL_ID = process.env.TIKTOK_PIXEL_ID;
  const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("Faltan variables de entorno: TIKTOK_PIXEL_ID o TIKTOK_ACCESS_TOKEN");
    return res.status(500).json({ error: "Faltan variables de entorno" });
  }

  try {
    const payload = {
      pixel_code: PIXEL_ID,
      event: "CompletePayment",
      test_event_code: "TEST123456",
      properties: {
        value: 100,
        currency: "USD",
      },
    };

    const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Respuesta de TikTok API:", data);

    return res.status(200).json({ message: "Evento enviado", data });
  } catch (err) {
    console.error("Error al enviar evento a TikTok:", err);
    return res.status(500).json({ error: "Error al enviar evento" });
  }
}
