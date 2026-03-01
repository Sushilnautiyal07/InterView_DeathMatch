// Piston API is a service which is used for the code excecution

// const PISTON_API = "https://interview-deathmatch.onrender.com/api/run";

const PISTON_API = `${import.meta.env.VITE_BACKEND_URL}/api/run`;

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${PISTON_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    console.log("PISTON RESPONSE:", data); 

   
    if (!data.run) {
      return {
        success: false,
        error: "Execution failed (no run data returned)",
      };
    }

    const stdout = data.run.stdout || "";
    const stderr = data.run.stderr || "";


    if (stderr) {
      return {
        success: false,
        output: stdout,
        error: stderr,
      };
    }

    // success case
    return {
      success: true,
      output: stdout || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}