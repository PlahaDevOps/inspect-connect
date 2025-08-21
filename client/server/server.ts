import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import fs from 'fs';
import { connectDatabase } from './config/databaseConfig';
import indexRouter from './routes/index';
import adminRoutes from './routes/adminRoutes';
import apiRoutes from './routes/apiRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/swagger-output.json';
import bodyParser from 'body-parser';

dotenv.config();

// Cleanup temporary files
const cleanupTempFiles = () => {
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      });
    });
  }
};

// Cleanup on startup and every hour
cleanupTempFiles();
setInterval(cleanupTempFiles, 60 * 60 * 1000);

const app = express();
app.use(bodyParser.json());

connectDatabase().then(() => {
  const http = createServer(app);

  app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
  }));

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

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  app.use('/', indexRouter);
  app.use('/admin', adminRoutes);
  app.use('/api/v1', apiRoutes);

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
