import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { base64 } = req.body;

  try {
    const binary = Buffer.from(base64, "base64");
    const pdf = await getDocument({ data: binary }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    res.status(200).json({ text });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
