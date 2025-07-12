import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/tiktok-event', (req, res) => {
  const { event, value } = req.body;

  if (!event || !value) {
    return res.status(400).json({ error: 'Missing event or value' });
  }

  console.log('Received TikTok event:', { event, value });

  res.status(200).json({ message: 'Event received successfully' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
