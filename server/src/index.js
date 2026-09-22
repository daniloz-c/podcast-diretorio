import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import podcastIndexRoutes from './routes/podcastindex.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Letterboxd Podcast Server', timestamp: new Date() });
});

// API Routes
app.use('/api', podcastIndexRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Letterboxd Podcast Server running on http://localhost:${PORT}`);
});
