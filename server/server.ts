import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { connectDatabase } from './config/databaseConfig';
import indexRouter from './routes/index';
import adminRoutes from './routes/adminRoutes';
import apiRoutes from './routes/apiRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/swagger-output.json';

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
});
const app = express();

connectDatabase().then(() => {
  const http = createServer(app);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://inspect-connect-test-bgb3gea5c0ezfkfe.canadacentral-01.azurewebsites.net',
    'https://inspect-connect-test.azurewebsites.net',
    /\.azurewebsites\.net$/, // Allow any Azure Web App subdomain
    /\.canadacentral-01\.azurewebsites\.net$/ // Allow Canada Central region
  ],
  credentials: true
}));
app.use("/api/v1/webhook", express.raw({ type: "application/json" }));
// app.use("/api/v1/payments", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp'),
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  debug: false,
  safeFileNames: true,
  preserveExtension: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', apiRoutes);
app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5002;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

}).catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

export default app;
