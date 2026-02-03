import express from 'express';
import path from 'path';
import cors from 'cors';
import {serve} from 'inngest/express';

import {ENV} from './lib/env.js';
import {connectDB} from './lib/db.js';
import {inngest ,functions} from './lib/inngest.js';


const app = express();
const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
}));

app.use("/api/inngest", serve({client: inngest, functions}));

app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'api is running' });
});

if(ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}




const startServer = async () => {
  
try {
  await  connectDB();
  app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
 
});
}catch (error) {
  console.error(' ❌Failed to start server', error);
  process.exit(1);
}
};

startServer();