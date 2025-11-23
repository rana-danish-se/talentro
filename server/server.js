import express from 'express';
import apiRouter from './routes/index.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Hello from Talentro server' });
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
