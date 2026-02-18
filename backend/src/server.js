import express from 'express';
import path from 'path';
import cors from 'cors';
import {serve} from 'inngest/express';
import {clerkMiddleware} from "@clerk/express";
import chatRoutes from './routes/chatRoutes.js';

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
app.use(clerkMiddleware());

app.use("/api/inngest", serve({client: inngest, functions}));
app.use("/api/chat", chatRoutes);

// CODE RUN ROUTE (piston proxy)
app.post("/api/run", async (req, res) => {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log("Piston error:", error);
    res.status(500).json({ error: "Code execution failed" });
  }
});



app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'api is running' });
});

if(ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/{*any}', (req, res) => {
    res.redirect(ENV.CLIENT_URL);
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