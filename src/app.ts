import express, { Application } from 'express';
import httpStatus from 'http-status';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import envConfig from './config/env.config';
import notFound from './middlewares/notFound';
import globalError from './middlewares/globalError';

import router from './routes';

const app: Application = express();

// const allowedOrigin =
//   process.env.NODE_ENV === 'development'
//     ? `'http://localhost:5173'`
//     : `${envConfig.CLIENT_URL}`;

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
if (envConfig.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(
  cors({
    origin: [
      'https://asgmt9-multi-vendor-e-commerce.netlify.app',
      'http://localhost:5173',
    ],
    credentials: true,
  }),
);

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// TEST ROUTE
app.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Hello from test route',
  });
});

// ROUTES
app.use('/api/v1', router);

// NOT FOUND ROUTE
app.use(notFound);

// GLOBAL MIDDLEWARE
app.use(globalError);

export default app;
