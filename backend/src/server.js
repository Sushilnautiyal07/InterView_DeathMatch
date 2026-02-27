import express from 'express';
import path from 'path';
import cors from 'cors';
import { serve } from 'inngest/express';
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from './routes/chatRoutes.js';

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import { inngest, functions } from './lib/inngest.js';


const app = express();
const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
}));
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

// CODE RUN ROUTE (piston proxy)
app.post("/api/run", async (req, res) => {
  try {
    const { language, files } = req.body;
    let code = files?.[0]?.content;

    if (language === "java") {
      // remove any public class name
      code = code.replace(/public class\s+\w+/, "public class Main");

      // agar class hi nahi likhi user ne
      if (!code.includes("public class")) {
        code = `
public class Main {
    public static void main(String[] args) {
        ${code}
    }
}
`;
      }
    }

    const languageMap = {
      javascript: 63,
      python: 71,
      java: 62,
    };

    // submit code
    const submit = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageMap[language],
          stdin: "",
        }),
      }
    );

    const submitData = await submit.json();
    const token = submitData.token;

    // wait compile
    await new Promise(r => setTimeout(r, 2500));

    // get result
    const result = await fetch(
      `https://ce.judge0.com/submissions/${token}?base64_encoded=false`
    );

    const resultData = await result.json();

    res.json({
      run: {
        stdout: resultData.stdout,
        stderr: resultData.stderr,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Execution failed" });
  }
});



app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'api is running' });
});

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/{*any}', (req, res) => {
    res.redirect(ENV.CLIENT_URL);
  });
}




const startServer = async () => {

  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);

    });
  } catch (error) {
    console.error(' ❌Failed to start server', error);
    process.exit(1);
  }
};

startServer();