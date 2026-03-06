export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text, base64, fileType } = req.body;

  const prompt = `Extract all data from this resume and return ONLY a JSON object with NO other text, no markdown, no backticks, no explanation.

STRIP all contact info: phone numbers, email addresses, street addresses, cities, LinkedIn URLs, personal websites.

Return exactly this JSON structure with all fields populated:
{
  "fullName": "First Last",
  "jobTitle": "Job Title Here",
  "profileSummary": "Full profile text here...",
  "education": [{"institution": "School Name", "year": "Year", "degree": "Degree Name"}],
  "skills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "languages": [{"language": "English", "level": "Native"}],
  "workExperience": [{"company": "Company Name", "role": "Role Title", "startDate": "Jan 2020", "endDate": "Present", "bullets": ["bullet 1", "bullet 2"]}]
}`;

  let messageContent = [];

  if (base64 && fileType === "pdf") {
    messageContent = [
      { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
      { type: "text", text: prompt }
    ];
  } else {
    messageContent = [{ type: "text", text: prompt + "\n\nResume text:\n" + text }];
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: "You are a resume parser. You output ONLY raw JSON with no markdown formatting, no backticks, no explanation. Just the JSON object starting with { and ending with }.",
      messages: [
        { role: "user", content: messageContent },
        { role: "assistant", content: "{" }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: data.error?.message || "API error", raw: JSON.stringify(data) });
  
  const raw = data.content?.find(b => b.type === "text")?.text || "";
  const full = "{" + raw;
  
  try {
    res.status(200).json(JSON.parse(full));
  } catch(e) {
    res.status(500).json({ error: e.message, raw: full.slice(0, 500) });
  }
}
