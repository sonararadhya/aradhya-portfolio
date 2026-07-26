// Vercel Serverless Function: /api/chat
// Securely proxies chatbot queries to Groq LLaMA 3.1 with automatic API Key Failover

const SYSTEM_PROMPT = `You are "Aradhya AI", an intelligent, professional, and friendly AI assistant representing Aradhya Santosh Sonar on his personal portfolio website.

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

FEATURED PROJECTS:
1. Chess7Knight (Live App: https://chess7knight.vercel.app/ | GitHub: https://github.com/sonararadhya/Chess7Knight):
   - Full-Stack interactive MERN chess application.
   - Features 12+ custom board themes, 20+ tactical puzzles, Stockfish engine review, real-time Socket.io multiplayer, and persistent ELO history.
2. NetChronaix (Live App: https://netchronaix.vercel.app/ | GitHub: https://github.com/sonararadhya/netchronaix):
   - Real-time network telemetry and traffic monitoring platform.
   - Designed for microservice latency profiling, CORS debugging, and packet telemetry.
3. Reunite AI:
   - Computer vision facial recognition pipeline built with OpenCV & InsightFace for missing person identification.
4. MedAI Suite:
   - Diagnostic machine learning platform for medical image classification and patient prognosis.

FULL TECH STACK & SKILLS:
- Languages: Python, JavaScript, TypeScript, C++, Java, R, SQL, HTML5, CSS3
- Frontend: React.js, Next.js, Tailwind CSS, Three.js, GSAP, Responsive UI Design
- Backend: Node.js, Express.js, FastAPI, RESTful APIs, WebSockets (Socket.io)
- Data Analytics & AI: Power BI, DAX, Power Query, Microsoft Fabric, OpenCV, Scikit-Learn, Pandas, NumPy
- Databases & Cloud: Supabase, MongoDB Atlas, PostgreSQL, AWS, Azure, Git, Docker, Vercel

CERTIFICATIONS:
- Microsoft Certified: Azure AI Fundamentals (AI-900)
- Microsoft Certified: Azure Fundamentals (AZ-900)
- Microsoft Certified: Azure Data Fundamentals (DP-900)
- Microsoft Certified: Power Platform Fundamentals (PL-900)
- IBM Getting Started with Artificial Intelligence
- Power BI Internship & Advanced Web Development Certifications

INSTRUCTIONS FOR BOT RESPONSES:
- Be concise, engaging, professional, and polite.
- Always highlight Aradhya's accomplishments and encourage recruiters/clients to hire him or reach out via Email or LinkedIn.
- Format responses using markdown bolding, bullet points, and clean line breaks.
- If asked about projects, mention the live Vercel links (chess7knight.vercel.app & netchronaix.vercel.app).
`;

export default async function handler(req, res) {
  // Set CORS headers
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

    // Retrieve environment keys from Vercel (Automatic Failover between Key 1 and Key 2)
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

    // Try primary key first, if exhausted/rate-limited (HTTP 429), failover to secondary key
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
            temperature: 0.6,
            max_tokens: 450
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
          continue; // Try next key in loop
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
