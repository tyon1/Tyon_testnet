// ========================
// CONFIG (TESTNET)
// ========================
const OPERATOR_ID = "0.0.5073987";
const TOPIC_ID = "0.0.6607223";
const NETWORK = "testnet";

// ========================
// STEP 1 — IDENTITY
// ========================
const identityForm = document.getElementById("identityForm");
const proceedBtn = document.getElementById("proceedBtn");

identityForm.addEventListener("input", () => {
  const name = document.getElementById("userName").value.trim();
  const company = document.getElementById("companyName").value.trim();
  proceedBtn.disabled = !(name && company);
});

identityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("identityScreen").classList.add("hidden");
  document.getElementById("uploadScreen").classList.remove("hidden");
});

// ========================
// STEP 2 — PDF PARSING
// ========================
const pdfInput = document.getElementById("pdfFile");

pdfInput.addEventListener("change", async () => {
  const file = pdfInput.files[0];
  if (!file) return;

  // Set filename
  document.getElementById("filename").value = file.name;

  // Default page count placeholder
  const pageCountField = document.getElementById("pageCount");
  pageCountField.value = "Detecting...";

  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    pageCountField.value = pdf.numPages;

    // Enable buttons once PDF is loaded
    ["encryptBtn","decryptBtn","obfuscateBtn","maskBtn","copyBtn"].forEach(id=>{
      const btn = document.getElementById(id);
      if(btn) btn.disabled = false;
    });
  } catch (err) {
    console.error("PDF.js error:", err);
    pageCountField.value = "N/A";
  }
});

// ========================
// Action Buttons (Testnet Demo)
// ========================
function demoAction(name){
  alert(`${name} action executed (Testnet demo).`);
}

document.getElementById("encryptBtn").addEventListener("click", ()=>demoAction("Encrypt"));
document.getElementById("decryptBtn").addEventListener("click", ()=>demoAction("Decrypt"));
document.getElementById("obfuscateBtn").addEventListener("click", ()=>demoAction("Obfuscate"));
document.getElementById("maskBtn").addEventListener("click", ()=>demoAction("Mask"));
document.getElementById("copyBtn").addEventListener("click", ()=>{
  const filename = document.getElementById("filename").value;
  navigator.clipboard.writeText(filename).then(()=>alert("Filename copied!"));
});

// ========================
// SUBMIT + SHOW RESULTS
// ========================
document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const filename = document.getElementById("filename").value;
  const pages = document.getElementById("pageCount").value;
  const memo = document.getElementById("memo").value;

  const payload = {
    operator: OPERATOR_ID,
    topic: TOPIC_ID,
    filename,
    pages,
    memo,
    ts: Date.now(),
    network: NETWORK
  };

  // Encode as demo output
  const encoded = btoa(JSON.stringify(payload));
  const blob = new Blob([encoded], { type: "text/plain" });

  document.getElementById("resultsBox").classList.remove("hidden");
  document.getElementById("tyonId").textContent = filename;
  document.getElementById("timestamp").textContent = pages;

  document.getElementById("hashscanLink").href =
    `https://hashscan.io/testnet/topic/${TOPIC_ID}`;

  document.getElementById("stampedPdfLink").href =
    URL.createObjectURL(blob);
});
