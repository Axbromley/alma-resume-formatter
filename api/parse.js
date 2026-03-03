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
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Extract the following fields from this resume text and return ONLY a JSON object with no markdown, no backticks, no preamble.

Fields:
- fullName (string)
- jobTitle (string)
- profileSummary (string, 2-4 sentences)
- education (array of {institution, year, degree})
- skills (array of strings, max 12)
- links (array of {platform, url})
- languages (array of {language, level})
- workExperience (array of {company, role, startDate, endDate, bullets: string[]})

Resume text:
${text}`
      }]
    })
  });
  const data = await response.json();
  const content = data.content?.find(b => b.type === "text")?.text || "{}";
  try {
    res.status(200).json(JSON.parse(content.replace(/```json|```/g, "").trim()));
  } catch {
    res.status(500).json({ error: "Parse failed" });
  }
}
