import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { event, value } = req.body;

  const validEvents = ['ViewContent', 'ClickButton'];
  if (!validEvents.includes(event)) {
    return res.status(400).json({ error: 'Tipo de evento no válido' });
  }

  const pixel_code = process.env.TIKTOK_PIXEL_ID || 'D1OT0CJC77U5IDGMJ8DG' ;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

// 🛡️ Validación de seguridad antes de continuar
  if (!pixel_code || !accessToken) {
    return res.status(400).json({ error: 'Faltan variables de entorno necesarias' });
  }


  const eventData = {
  pixel_code: pixel_code || 'D1OT0CJC77U5IDGMJ8DG', // fallback explícito
  event,
  timestamp: Date.now().toString(), // TikTok lo espera como string, no como número
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
      return res.status(200).json({ success: true, result });
    } else {
      return res.status(500).json({ error: 'Error al enviar evento a TikTok', detalles: result });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
  }
}
