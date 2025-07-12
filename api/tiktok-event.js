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

  const pixelCode = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

const eventData = {
  pixelCode : 'D1OT0CJC77U5IDGMJ8DG' , // 👈 debe venir de .env
  event: event,
  timestamp: Math.floor(Date.now() / 1000),
  event_id: crypto.randomUUID(),
  properties: {
    value: value || '',
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
    ad: {},
    event_source: {
      event_source_type: 'web',
      event_source_id: 'www.robertsmart.tech'
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
      body: JSON.stringify({ data: [eventData] })
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
