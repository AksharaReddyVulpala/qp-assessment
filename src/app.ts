import express from 'express';
import type { Request, Response } from 'express';
import { initializeDatabase } from './config/database.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js'; 
import dotenv from 'dotenv';
import cartRouter from './routes/cart.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cart', cartRouter);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server.. running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();