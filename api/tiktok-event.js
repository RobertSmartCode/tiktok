// Archivo: api/tiktok-event.js

export default async function handler(req, res) {
  console.log("[DEBUG] Handler ejecutado");
  console.log("[DEBUG] Method:", req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { event, value } = req.body;
    console.log("[DEBUG] Body recibido:", req.body);

    // Validar datos básicos
    if (!event || typeof value === 'undefined') {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    // Aquí iría la lógica de envío a TikTok Events API
    // Simulación de respuesta exitosa
    return res.status(200).json({ message: 'Evento recibido', event, value });

  } catch (error) {
    console.error("[ERROR]", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
