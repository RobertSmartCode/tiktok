export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { event, value } = req.body;
  console.log('🟢 Evento recibido:', event, value);

  return res.status(200).json({ success: true, message: 'Evento recibido correctamente' });
}
