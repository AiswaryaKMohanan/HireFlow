import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { healthCheck } from './controllers/healthController.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv === 'development') app.use(morgan('dev'));

app.get('/health', healthCheck);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
