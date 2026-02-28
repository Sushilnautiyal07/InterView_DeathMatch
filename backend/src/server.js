import express from 'express';
import path from 'path';
import cors from 'cors';
import { serve } from 'inngest/express';
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from './routes/chatRoutes.js';
import sessionRoutes from "./routes/sessionRoute.js";

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import { inngest, functions } from './lib/inngest.js';


const app = express();
const __dirname = path.resolve();

//middlewares
// console.log("CLIENT URL:", ENV.CLIENT_URL);
app.use(express.json());
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
}));
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// CODE RUN ROUTE (piston proxy)
app.post("/api/run", async (req, res) => {
  try {
    const { language, files } = req.body;

    if (!files || !files[0]?.content) {
      return res.status(400).json({ error: "No code provided" });
    }

    let code = files[0].content;

    // 🔥 Java special handling
    if (language === "java") {
      // Rename any public class to Main
      code = code.replace(/public class\s+\w+/, "public class Main");

      // If no class provided, wrap code inside Main
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

    const languageId = languageMap[language];

    if (!languageId) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // 🔥 Submit code to Judge0
    const submitResponse = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: "",
        }),
      }
    );

    const submitData = await submitResponse.json();
    const token = submitData.token;

    if (!token) {
      return res.status(500).json({ error: "Submission failed" });
    }

    let resultData;

    // 🔥 Poll until execution finishes
    while (true) {
      const resultResponse = await fetch(
        `https://ce.judge0.com/submissions/${token}?base64_encoded=false`
      );

      resultData = await resultResponse.json();

      if (resultData.status?.id > 2) break; 
      // 1 = In Queue
      // 2 = Processing
      // >2 = Completed

      await new Promise(r => setTimeout(r, 1000));
    }

    res.json({
      run: {
        stdout: resultData.stdout,
        stderr: resultData.stderr,
      },
    });

  } catch (err) {
    console.error("Compiler Error:", err);
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