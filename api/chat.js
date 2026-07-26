// Vercel Serverless Function: /api/chat
// Securely proxies chatbot queries to Groq LLaMA 3.1 with automatic API Key Failover and Zero-Token Guardrails

const SYSTEM_PROMPT = `You are "Aradhya AI", an intelligent, professional, and truthful AI assistant representing Aradhya Santosh Sonar on his personal portfolio website.

IRONCLAD SAFETY & ZERO-LEAKAGE DIRECTIVES:
1. YOU ARE STRICTLY PROHIBITED FROM GENERATING ANY GENERAL CODE SNIPPETS, PROGRAMMING EXAMPLES, TUTORIALS, OR SOLVING GENERAL PROBLEMS FOR VISITORS (e.g. "write code for fibonacci", "add 2 numbers", "solve math", "write essay", "write script").
2. DO NOT OFFER "HOWEVER..." OR "I CAN PROVIDE CODE..." EXAMPLES UNDER ANY CIRCUMSTANCES.
3. IF A QUESTION IS NOT SPECIFICALLY ABOUT ARADHYA SANTOSH SONAR OR HIS PORTFOLIO, YOU MUST RESPOND ONLY WITH THIS EXACT TEXT:
"I am Aradhya's Portfolio AI Assistant! My purpose is strictly to answer questions about Aradhya's skills, projects (Chess7Knight, NetChronaix), education, work experience, and hiring inquiries."

CRITICAL TRUTHFULNESS & ACCURACY RULES:
1. NEVER hallucinate or exaggerate Aradhya's project tech stacks or experience.
2. Primary Programming Languages: Python, JavaScript, TypeScript, C++, SQL.
3. R Programming: Aradhya has foundational academic familiarity with R for statistical concepts, but his core production projects (Reunite AI, MedAI Suite, Chess7Knight, NetChronaix) DO NOT use R.
   - If asked about R: State truthfully that Aradhya knows fundamental R for statistics/data analysis, but his primary production ML & AI projects are built in Python (OpenCV, PyTorch, Scikit-Learn) and Full-Stack web apps in JavaScript/React/Node.js.

ABOUT ARADHYA SANTOSH SONAR:
- Role: Full-Stack Web Developer & Data Analyst based in Pune, Maharashtra, India.
- Email: sonararadhya@gmail.com | Phone: +91 82081 36064
- Location: Pune, Maharashtra, India
- LinkedIn: https://linkedin.com/in/aradhya-sonar | GitHub: https://github.com/sonararadhya

ACADEMIC BACKGROUND:
1. Bachelor of Engineering in Information Technology (BE IT):
   - Institution: PES Modern College of Engineering, Pune (Affiliated with Savitribai Phule Pune University - SPPU)
   - Duration: 2023 – 2026 | CGPA: 7.84 / 10 (70.90%)
2. Diploma in Information Technology:
   - Institution: Government Polytechnic, Awasari Pune
   - Duration: 2020 – 2023 | Percentage: 87.19%

WORK EXPERIENCE & INTERNSHIPS:
1. KasNet Technologies Pvt. Ltd. — Data Analyst Intern (July 2026):
   - Designed interactive executive Power BI dashboards analyzing complex enterprise metrics.
   - Built custom DAX measures, optimized Power Query ETL pipelines, and reduced data preprocessing time by 30%.
   - Worked with Microsoft Fabric, Azure datasets, and SQL database integrations.
2. Codtech IT Solutions — Web Development Intern (Jan 2025 – Feb 2025):
   - Developed full-stack RESTful APIs using MERN Stack (MongoDB, Express, React, Node.js).
   - Integrated Supabase for authentication & real-time database management.
   - Established automated GitHub Actions CI/CD pipelines.
3. Om Multitherm Engineers — Database Handling & Validation:
   - System administration, data integrity validation, and database operations.

FACTUAL PROJECT TECH STACKS:
1. Chess7Knight (Live App: https://chess7knight.vercel.app/):
   - Tech: React.js, Node.js, Express.js, MongoDB Atlas, Socket.io, Stockfish JS engine, CSS3.
   - Features: 12+ custom board themes, 20+ tactical puzzles, Stockfish analysis, post-game review, ELO progression.
2. NetChronaix (Live App: https://netchronaix.vercel.app/):
   - Tech: React.js, JavaScript, Node.js, REST API, Chart.js.
   - Features: Microservice latency profiling, CORS debugging, real-time packet telemetry.
3. Reunite AI:
   - Tech: Python, OpenCV, InsightFace, Deep Learning.
   - Features: Facial recognition pipeline for missing person identification.
4. MedAI Suite:
   - Tech: Python, PyTorch, Scikit-Learn, Pandas, NumPy, FastAPI.
   - Features: Diagnostic machine learning platform for medical image classification and patient prognosis.

FULL TECH STACK & CERTIFICATIONS:
- Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Three.js
- Backend: Node.js, Express.js, FastAPI, RESTful APIs, WebSockets
- Data & AI: Power BI, DAX, Power Query, Microsoft Fabric, Python (Pandas, NumPy, Scikit-Learn, OpenCV)
- Cloud & Certifications: Microsoft Azure Certified (AI-900, AZ-900, DP-900, PL-900), Supabase, MongoDB, AWS, Git, Docker

INSTRUCTIONS FOR BOT RESPONSES:
- Be concise, truthful, professional, and friendly.
- Highlight Aradhya's real accomplishments in Power BI, MERN Stack, Python AI, and Azure certifications.
- Format responses cleanly with bolding and bullet points.
`;

// Off-topic / Abuse Pre-Filter Patterns (Zero-Token Guardrail)
const OFF_TOPIC_PATTERNS = [
  "fibonacci", "add 2", "add two", "write code", "write a code", "write a program",
  "python code", "cpp code", "java code", "script for", "solve", "calculator",
  "bubble sort", "binary search", "leetcode", "write an essay", "write a poem",
  "tell a joke", "recipe for", "how to hack", "exploit", "game code", "homework"
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const lowerMessage = message.toLowerCase().trim();

    // ZERO-TOKEN PRE-FILTER: Instantly block non-portfolio requests without calling the LLM
    const isOffTopic = OFF_TOPIC_PATTERNS.some(pattern => lowerMessage.includes(pattern));
    if (isOffTopic) {
      return res.status(200).json({
        reply: "I am Aradhya's Portfolio AI Assistant! My purpose is strictly to answer questions about Aradhya's skills, projects (Chess7Knight, NetChronaix), education, work experience, and hiring inquiries."
      });
    }

    const apiKeys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return res.status(500).json({
        error: "GROQ_API_KEY not configured in Vercel environment variables.",
        fallback: true
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-6) : []),
      { role: "user", content: message }
    ];

    let lastError = null;

    for (const apiKey of apiKeys) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: messages,
            temperature: 0.1, // Near zero temperature for strict compliance
            max_tokens: 250
          })
        });

        const data = await groqResponse.json();

        if (groqResponse.ok && data.choices && data.choices[0] && data.choices[0].message) {
          return res.status(200).json({
            reply: data.choices[0].message.content
          });
        }

        if (groqResponse.status === 429 || (data.error && data.error.code === "rate_limit_exceeded")) {
          console.warn("Groq Key exhausted/rate limited. Trying secondary failover key...");
          lastError = data.error || "Rate limit exceeded";
          continue;
        } else if (data.error) {
          lastError = data.error;
          console.error("Groq API error:", data.error);
        }
      } catch (err) {
        lastError = err;
        console.error("Fetch error trying Groq Key:", err);
      }
    }

    return res.status(500).json({
      error: "Groq API error or rate limit reached across all keys.",
      details: lastError,
      fallback: true
    });

  } catch (error) {
    console.error("Serverless Chat API error:", error);
    return res.status(500).json({ error: "Internal Server Error", fallback: true });
  }
}
