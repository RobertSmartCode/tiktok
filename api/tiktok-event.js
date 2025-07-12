export default function handler(req, res) {
  if (req.method === 'POST') {
    const { event, value } = req.body;

    console.log('📩 Evento recibido:', event, value);

    // Aquí podrías agregar lógica para enviar a TikTok

    res.status(200).json({ success: true, message: 'Evento recibido' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
