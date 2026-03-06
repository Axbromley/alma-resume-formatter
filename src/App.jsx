import { useState, useCallback } from "react";

const ALMA_BLUE = "#4a5f7a";

async function parseResumeWithClaude(rawText) {
  const response = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: rawText })
  });
  if (!response.ok) throw new Error("API error");
  return response.json();
}

function generateResumeHTML(resume) {
  const { fullName="", jobTitle="", profileSummary="", education=[], skills=[], links=[], languages=[], workExperience=[] } = resume;
  const nameParts = fullName.trim().split(" ");
  const lastName = nameParts.pop() || "";
  const firstName = nameParts.join(" ");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Source+Sans+3:wght@300;400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Source Sans 3',sans-serif;}.page{display:flex;width:210mm;min-height:297mm;}.sidebar{width:68mm;background:#4a5f7a;color:white;padding:32px 20px;flex-shrink:0;}.sidebar-section{margin-bottom:28px;}.sidebar-title{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#a8c4d8;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.2);}.edu-school{font-size:11px;font-weight:600;color:white;margin-bottom:2px;}.edu-degree{font-size:10.5px;color:#c8dce8;}.skill-item{font-size:10px;color:#dde8f0;padding:2px 0;letter-spacing:0.5px;text-transform:uppercase;display:flex;align-items:center;gap:6px;}.skill-item::before{content:"•";color:#a8c4d8;}.link-item{font-size:10.5px;color:#a8d4f0;margin-bottom:4px;}.link-platform{font-weight:600;color:#dde8f0;font-size:10.5px;}.lang-item{font-size:11px;color:#dde8f0;padding:2px 0;display:flex;align-items:center;gap:6px;}.lang-item::before{content:"•";color:#a8c4d8;}.main{flex:1;}.header{background:white;padding:32px 32px 20px 32px;border-bottom:3px solid #4a5f7a;display:flex;justify-content:space-between;align-items:flex-start;}.name-first{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;color:#4a5f7a;letter-spacing:1px;line-height:1;text-transform:uppercase;}.name-last{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:400;color:#2d3a47;letter-spacing:1px;line-height:1;text-transform:uppercase;}.job-title{font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#6b7f92;text-transform:uppercase;margin-top:6px;}.title-underline{width:40px;height:3px;background:#4a5f7a;margin-top:8px;}.alma-logo{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:800;color:#4a5f7a;letter-spacing:3px;border:2px solid #4a5f7a;padding:4px 10px;}.content{padding:24px 32px;}.section{margin-bottom:24px;}.section-title{font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#4a5f7a;margin-bottom:8px;padding-bottom:6px;border-bottom:1.5px solid #4a5f7a;}.profile-text{font-size:11.5px;line-height:1.7;color:#3a4a5a;text-align:justify;}.job{margin-bottom:18px;padding-left:14px;border-left:3px solid #4a5f7a;}.job-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;}.job-company{font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;color:#2d3a47;text-transform:uppercase;}.job-dates{font-size:10.5px;color:#6b7f92;font-weight:600;}.job-role{font-size:11px;color:#6b7f92;margin-bottom:6px;}.job-bullets{list-style:none;padding:0;}.job-bullets li{font-size:11px;color:#3a4a5a;line-height:1.6;padding:2px 0 2px 14px;position:relative;}.job-bullets li::before{content:"•";position:absolute;left:0;color:#4a5f7a;font-weight:bold;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body><div class="page"><div class="sidebar">${education.length?`<div class="sidebar-section"><div class="sidebar-title">Education</div>${education.map(e=>`<div style="margin-bottom:12px"><div class="edu-school">${e.institution}${e.year?` / ${e.year}`:""}</div><div class="edu-degree">${e.degree}</div></div>`).join("")}</div>`:""} ${skills.length?`<div class="sidebar-section"><div class="sidebar-title">Skills</div>${skills.map(s=>`<div class="skill-item">${s}</div>`).join("")}</div>`:""} ${links.length?`<div class="sidebar-section"><div class="sidebar-title">Links</div>${links.map(l=>`<div style="margin-bottom:6px"><div class="link-platform">${l.platform}</div><div class="link-item">${l.url}</div></div>`).join("")}</div>`:""} ${languages.length?`<div class="sidebar-section"><div class="sidebar-title">Languages</div>${languages.map(l=>`<div class="lang-item">${l.language}${l.level?` (${l.level})`:""}</div>`).join("")}</div>`:""}</div><div class="main"><div class="header"><div class="name-block"><div><span class="name-first">${firstName} </span><span class="name-last">${lastName}</span></div><div class="job-title">${jobTitle}</div><div class="title-underline"></div></div><div class="alma-logo">ALMA</div></div><div class="content">${profileSummary?`<div class="section"><div class="section-title">Profile</div><p class="profile-text">${profileSummary}</p></div>`:""} ${workExperience.length?`<div class="section"><div class="section-title">Work Experience</div>${workExperience.map(job=>`<div class="job"><div class="job-header"><span class="job-company">${job.company}</span><span class="job-dates">${job.startDate}${job.endDate?` - ${job.endDate}`:""}</span></div><div class="job-role">${job.role}</div>${job.bullets?.length?`<ul class="job-bullets">${job.bullets.map(b=>`<li>${b}</li>`).join("")}</ul>`:""}</div>`).join("")}</div>`:""}</div></div></div></body></html>`;
}

export default function App() {
  const [step, setStep] = useState("upload");
  const [resumeData, setResumeData] = useState(null);
  const [resumeHTML, setResumeHTML] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file) => {
    setFileName(file.name);
    setError("");
    setStep("parsing");
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        const base64 = btoa(binary);
        const response = await fetch("/api/extract-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64 })
        });
        const result = await response.json();
        text = result.text || "";
      } else {
        text = await file.text();
      }
      if (!text.trim()) throw new Error("Could not extract text. Try a text-based PDF or .txt file.");
      const parsed = await parseResumeWithClaude(text);
      setResumeData(parsed);
      setResumeHTML(generateResumeHTML(parsed));
      setStep("preview");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep("upload");
    }
  }, []);

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) processFile(file); }, [processFile]);
  const handleFileInput = useCallback((e) => { const file = e.target.files[0]; if (file) processFile(file); }, [processFile]);

  const downloadPDF = () => {
    const win = window.open("", "_blank");
    win.document.write(resumeHTML);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 800);
  };

  const reset = () => { setStep("upload"); setResumeData(null); setResumeHTML(""); setError(""); setFileName(""); };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a2535 0%,#2d3f55 50%,#1a2535 100%)", fontFamily:"'Segoe UI',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:"40px" }}>
        <div style={{ display:"inline-block", border:"2px solid #a8c4d8", padding:"6px 16px", letterSpacing:"4px", fontSize:"22px", fontWeight:"800", color:"#a8c4d8", marginBottom:"12px" }}>ALMA</div>
        <h1 style={{ color:"white", fontSize:"26px", fontWeight:"300", letterSpacing:"1px" }}>Resume Formatter</h1>
        <p style={{ color:"#7a9bb5", fontSize:"14px", marginTop:"6px" }}>Upload any resume — get it formatted to ALMA standard</p>
      </div>
      <div style={{ background:"white", borderRadius:"16px", width:"100%", maxWidth:"640px", boxShadow:"0 24px 60px rgba(0,0,0,0.4)", overflow:"hidden" }}>
        {step === "upload" && (
          <div style={{ padding:"48px 40px" }}>
            <div onDrop={handleDrop} onDragOver={(e)=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onClick={()=>document.getElementById("fileInput").click()} style={{ border:`2px dashed ${dragOver?"#4a5f7a":"#c8d8e8"}`, borderRadius:"12px", padding:"48px 32px", textAlign:"center", cursor:"pointer", background:dragOver?"#f0f6ff":"#fafcff", transition:"all 0.2s" }}>
              <div style={{ fontSize:"48px", marginBottom:"16px" }}>📄</div>
              <p style={{ fontSize:"16px", fontWeight:"600", color:"#2d3a47", marginBottom:"8px" }}>Drop resume here or click to browse</p>
              <p style={{ fontSize:"13px", color:"#7a9bb5" }}>Supports PDF and plain text files</p>
              <input id="fileInput" type="file" accept=".pdf,.txt" style={{ display:"none" }} onChange={handleFileInput} />
            </div>
            {error && <div style={{ marginTop:"16px", padding:"12px 16px", background:"#fff0f0", border:"1px solid #ffcccc", borderRadius:"8px", color:"#c0392b", fontSize:"13px" }}>⚠️ {error}</div>}
          </div>
        )}
        {step === "parsing" && (
          <div style={{ padding:"64px 40px", textAlign:"center" }}>
            <div style={{ width:"60px", height:"60px", border:"4px solid #f0f4f8", borderTop:`4px solid ${ALMA_BLUE}`, borderRadius:"50%", margin:"0 auto 24px", animation:"spin 1s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
            <p style={{ fontSize:"17px", fontWeight:"600", color:"#2d3a47", marginBottom:"8px" }}>Formatting {fileName}</p>
            <p style={{ fontSize:"13px", color:"#7a9bb5" }}>Claude is reading and restructuring the resume...</p>
          </div>
        )}
        {step === "preview" && resumeData && (
          <div>
            <div style={{ background:ALMA_BLUE, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ color:"white" }}>
                <span style={{ fontSize:"16px", fontWeight:"700" }}>✓ {resumeData.fullName}</span>
                <span style={{ fontSize:"12px", color:"#a8c4d8", marginLeft:"12px" }}>{resumeData.jobTitle}</span>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={reset} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"white", padding:"8px 14px", borderRadius:"6px", cursor:"pointer", fontSize:"12px" }}>↩ New</button>
                <button onClick={downloadPDF} style={{ background:"white", border:"none", color:ALMA_BLUE, padding:"8px 16px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", fontWeight:"700" }}>⬇ Download PDF</button>
              </div>
            </div>
            <div style={{ padding:"24px 28px" }}>
              <p style={{ fontSize:"12px", color:"#7a9bb5", marginBottom:"16px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase" }}>Extracted Data</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                {[
                  { label:"Profile Summary", value:resumeData.profileSummary?"✓ Found":"—", ok:!!resumeData.profileSummary },
                  { label:"Work Experience", value:`${resumeData.workExperience?.length||0} positions`, ok:resumeData.workExperience?.length>0 },
                  { label:"Skills", value:`${resumeData.skills?.length||0} skills`, ok:resumeData.skills?.length>0 },
                  { label:"Education", value:`${resumeData.education?.length||0} entries`, ok:resumeData.education?.length>0 },
                  { label:"Languages", value:`${resumeData.languages?.length||0} found`, ok:resumeData.languages?.length>0 },
                  { label:"Links", value:`${resumeData.links?.length||0} found`, ok:true },
                ].map(item => (
                  <div key={item.label} style={{ background:"#f8fafc", borderRadius:"8px", padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"12px", color:"#5a6a7a" }}>{item.label}</span>
                    <span style={{ fontSize:"12px", fontWeight:"700", color:item.ok?ALMA_BLUE:"#aaa" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <button onClick={downloadPDF} style={{ marginTop:"20px", width:"100%", background:ALMA_BLUE, color:"white", border:"none", padding:"14px", borderRadius:"8px", fontSize:"15px", fontWeight:"700", cursor:"pointer" }}>
                Download ALMA-Formatted Resume (PDF)
              </button>
              <p style={{ fontSize:"11px", color:"#aaa", textAlign:"center", marginTop:"10px" }}>A print dialog will open — select "Save as PDF"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
