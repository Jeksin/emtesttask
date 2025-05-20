import express from 'express';
import cors from 'cors';
import appealsRouter from './routes/appeals';
import prisma from './utils/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});
app.use(appealsRouter);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Сервер запущен на порту ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});