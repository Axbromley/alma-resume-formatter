export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: `You are extracting data from a resume. Return ONLY valid JSON, no markdown, no backticks.

CRITICAL: Strip ALL contact info (phone, email, address, city, LinkedIn, websites). Copy everything else verbatim.

Return this structure:
{
  "fullName": "",
  "jobTitle": "",
  "profileSummary": "",
  "education": [{"institution": "", "year": "", "degree": ""}],
  "skills": [],
  "tools": [],
  "languages": [{"language": "", "level": ""}],
  "workExperience": [{"company": "", "role": "", "startDate": "", "endDate": "", "bullets": []}]
}

Resume text:
` + text }]
    })
  });

  const data = await response.json();
  const raw = data.content?.find(b => b.type === "text")?.text || "{}";
  try {
    res.status(200).json(JSON.parse(raw.replace(/```json|```/g, "").trim()));
  } catch(e) {
    res.status(500).json({ error: "Parse failed", raw });
  }
}
