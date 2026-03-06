export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text, base64, fileType } = req.body;

  let messageContent = [];

  if (base64 && fileType === "pdf") {
    messageContent = [
      {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: base64
        }
      },
      {
        type: "text",
        text: "Extract data from this resume. Return ONLY valid JSON, no markdown, no backticks.\n\nCRITICAL: Strip ALL contact info (phone numbers, email addresses, home address, city, LinkedIn URLs, personal websites). Copy everything else verbatim.\n\nReturn exactly this structure:\n{\n  \"fullName\": \"\",\n  \"jobTitle\": \"\",\n  \"profileSummary\": \"\",\n  \"education\": [{\"institution\": \"\", \"year\": \"\", \"degree\": \"\"}],\n  \"skills\": [],\n  \"tools\": [],\n  \"languages\": [{\"language\": \"\", \"level\": \"\"}],\n  \"workExperience\": [{\"company\": \"\", \"role\": \"\", \"startDate\": \"\", \"endDate\": \"\", \"bullets\": []}]\n}"
      }
    ];
  } else {
    messageContent = [{
      type: "text",
      text: "Extract data from this resume. Return ONLY valid JSON, no markdown, no backticks.\n\nCRITICAL: Strip ALL contact info (phone numbers, email addresses, home address, city, LinkedIn URLs, personal websites). Copy everything else verbatim.\n\nReturn exactly this structure:\n{\n  \"fullName\": \"\",\n  \"jobTitle\": \"\",\n  \"profileSummary\": \"\",\n  \"education\": [{\"institution\": \"\", \"year\": \"\", \"degree\": \"\"}],\n  \"skills\": [],\n  \"tools\": [],\n  \"languages\": [{\"language\": \"\", \"level\": \"\"}],\n  \"workExperience\": [{\"company\": \"\", \"role\": \"\", \"startDate\": \"\", \"endDate\": \"\", \"bullets\": []}]\n}\n\nResume text:\n" + text
    }];
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
      max_tokens: 2000,
      messages: [{ role: "user", content: messageContent }]
    })
  });

  const data = await response.json();
  const raw = data.content?.find(b => b.type === "text")?.text || "{}";
  try {
    res.status(200).json(JSON.parse(raw.replace(/```json|```/g, "").trim()));
  } catch(e) {
    res.status(500).json({ error: e.message, raw: raw.slice(0, 500) });
  }
}
