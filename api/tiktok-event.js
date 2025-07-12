export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { event, value } = req.body;

  console.log('📩 Evento recibido:', event, value);

  // Aquí iría lógica de integración real
  return res.status(200).json({
    success: true,
    message: 'Evento recibido',
  });
}
