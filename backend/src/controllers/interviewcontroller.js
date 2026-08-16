import Interview from "../models/Interview.js";
import { v4 as uuidv4 } from "uuid";

export const initSession = async (req, res) => {
  try {
    const { jobRole, jobLevel, jobDescription, candidateId } = req.body;

    const sessionId = uuidv4();

    const interview = new Interview({
      sessionId,
      candidateId,
      jobRole,
      jobLevel,
      jobDescription,
      status: "in_progress"
    });

    await interview.save();

    res.json({ sessionId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to initialize session" });
  }
};


export const generateQuestions = async (req, res) => {
  try {
    const { jobRole, jobLevel, jobDescription } = req.body;

    const prompt = `
You are a professional technical interviewer.

Generate 5 interview questions for the following role.

Role: ${jobRole}
Experience level: ${jobLevel}
Skills / description: ${jobDescription}

Return ONLY a JSON array of questions.
Example:
["Question 1", "Question 2", "Question 3"]
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    const raw = data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      questions = cleaned
        .split("\n")
        .filter(q => q.trim().length > 5)
        .slice(0, 5)
        .map(q => q.replace(/^\d+[\).\s-]*/, ""));
    }

    res.json({ questions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI question generation failed" });
  }
};


export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, jobRole, jobLevel } = req.body;

    const prompt = `
You are a strict technical interviewer.

Question:
${question}

Candidate answer:
${answer}

Evaluate the answer for a ${jobRole} (${jobLevel} level).

Return JSON:
{
  "score": number from 0-10,
  "strengths": "...",
  "improvements": "..."
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    const raw = data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    res.json({ feedback: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
};


export const completeInterview = async (req, res) => {
  try {
    const { sessionId, questions, violations, terminatedEarly } = req.body;

    const overallScore = questions.length > 0
      ? questions.reduce((sum, q) => sum + (q.score || 0), 0) / questions.length
      : 0;

    await Interview.findOneAndUpdate(
      { sessionId },
      {
        questions,
        violations,
        overallScore: parseFloat(overallScore.toFixed(1)),
        status: terminatedEarly ? "terminated" : "completed",
        endTime: new Date()
      }
    );

    res.json({ success: true, overallScore });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save interview" });
  }
};


// fetch all interviews for a candidate (for dashboard history)
export const getMyInterviews = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const interviews = await Interview.find(
      { candidateId, status: { $in: ["completed", "terminated"] } },
      {
        sessionId: 1,
        jobRole: 1,
        jobLevel: 1,
        status: 1,
        overallScore: 1,
        startTime: 1,
        endTime: 1,
        "violations": 1,
      }
    ).sort({ startTime: -1 }).limit(20);

    res.json({ interviews });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
};

// delete one interview by sessionId
export const deleteInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Interview.findOneAndDelete({ sessionId });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete interview" });
  }
};


// fetch one full interview report by sessionId (for report page)
export const getInterviewById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const interview = await Interview.findOne({ sessionId });

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json({ interview });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch interview" });
  }
};