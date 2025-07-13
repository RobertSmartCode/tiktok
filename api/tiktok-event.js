import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

// ✅ Función handler para Next.js / Vercel
export default async function handler(req, res) {
  // 🔓 Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://www.robertsmart.tech'); // Puedes usar '*' temporalmente si es local
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ⚠️ Manejo de preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ❌ Solo POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { event, value } = req.body;
  console.log('📥 Evento recibido:', event, value);

  // 🎯 Validar eventos autorizados
  const validEvents = ['ViewContent', 'ClickButton', 'Lead', 'PageView'];
  if (!validEvents.includes(event)) {
    return res.status(400).json({ error: 'Tipo de evento no válido' });
  }

  // 🔐 Variables necesarias
  const pixel_code = process.env.TIKTOK_PIXEL_ID || 'D1OT0CJC77U5IDGMJ8DG';
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!pixel_code || !accessToken) {
    return res.status(400).json({ error: 'Faltan variables de entorno necesarias' });
  }

  // 🧠 Armar payload del evento
const eventoFinal = event === 'PageView' ? 'ViewContent' : event;

const eventData = {
  pixel_code,
  event: eventoFinal,
  timestamp: Date.now().toString(),
  event_id: crypto.randomUUID(),
  properties: {
    value: value || 0,
    currency: 'USD'
  },
  context: {
    user: {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      user_agent: req.headers['user-agent'] || ''
    },
    page: {
      url: req.headers.referer || 'https://www.robertsmart.tech/'
    },
    event_source: {
      event_source_type: 'web',
      event_source_id: 'robertsmart.tech'
    }
  }
};

console.log(`🚀 Enviando evento '${event}' (como '${eventoFinal}') a TikTok...`, eventData);


  // 📡 Enviar a API de TikTok
  try {
    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      },
      body: JSON.stringify(eventData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ TikTok respondió OK:', result);
      return res.status(200).json({ success: true, result });
    } else {
      console.error('❌ TikTok respondió con error:', result);
      return res.status(500).json({ error: 'Error al enviar evento a TikTok', detalles: result });
    }

  } catch (error) {
    console.error('❌ Error en backend:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
  }
}
