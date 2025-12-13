import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './src/utils/errorHandler';
import routes from './src/routes';
import { connectDB } from './src/config/db';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import { rateLimiter } from './src/middleware/rateLimiter';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL
  })
);
app.use(hpp());
app.use(rateLimiter);
app.use(morgan('common'));
app.use(express.json());
app.use(compression());

app.use('/api', routes);
app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

start().catch(() => {
  process.exit(1);
});

export default app;
