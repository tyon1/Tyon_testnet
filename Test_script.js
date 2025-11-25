document.addEventListener("DOMContentLoaded", () => {
  // ========================
  // CONFIG (TESTNET)
  // ========================
  const OPERATOR_ID = "0.0.5073987";
  const TOPIC_ID = "0.0.6607223";
  const NETWORK = "testnet";

  // ========================
  // ELEMENTS
  // ========================
  const elements = {
    proceedBtn: document.getElementById("proceedBtn"),
    userName: document.getElementById("userName"),
    companyName: document.getElementById("companyName"),
    identityScreen: document.getElementById("identityScreen"),
    uploadScreen: document.getElementById("uploadScreen"),
    pdfFile: document.getElementById("pdfFile"),
    filename: document.getElementById("filename"),
    pageCount: document.getElementById("pageCount"),
    memo: document.getElementById("memo"),
    submitBtn: document.getElementById("submitBtn"),
    resultsBox: document.getElementById("resultsBox"),
    tyonId: document.getElementById("tyonId"),
    timestamp: document.getElementById("timestamp"),
    hashscanLink: document.getElementById("hashscanLink"),
    stampedPdfLink: document.getElementById("stampedPdfLink")
  };

  // ========================
  // ENABLE PROCEED BUTTON (PRODUCTION STYLE)
  // ========================
  function validateInputs() {
    const valid = elements.userName.value.trim() && elements.companyName.value.trim();
    elements.proceedBtn.disabled = !valid;
    elements.proceedBtn.setAttribute("aria-disabled", !valid);
  }

  elements.userName.addEventListener("input", validateInputs);
  elements.companyName.addEventListener("input", validateInputs);

  elements.proceedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    elements.identityScreen.classList.add("hidden");
    elements.uploadScreen.classList.add("active");
  });

  // ========================
  // PDF FILE HANDLING
  // ========================
  elements.pdfFile.addEventListener("change", async () => {
    const file = elements.pdfFile.files[0];
    if (!file) return;

    elements.filename.value = file.name;
    elements.pageCount.value = "Detecting...";

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      elements.pageCount.value = pdf.numPages;
    } catch (err) {
      console.error("PDF.js error:", err);
      elements.pageCount.value = "N/A";
    }
  });

  // ========================
  // SUBMIT METADATA (SAFE TESTNET)
  // ========================
  elements.submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const payload = {
      operator: OPERATOR_ID,
      topic: TOPIC_ID,
      filename: elements.filename.value,
      pages: elements.pageCount.value,
      memo: elements.memo.value,
      ts: Date.now(),
      network: NETWORK
    };

    const encoded = btoa(JSON.stringify(payload));
    const blob = new Blob([encoded], { type: "text/plain" });

    // Show results (sandboxed)
    elements.resultsBox.classList.remove("hidden");
    elements.tyonId.textContent = elements.filename.value;
    elements.timestamp.textContent = elements.pageCount.value;
    elements.hashscanLink.href = `https://hashscan.io/testnet/topic/${TOPIC_ID}`;
    elements.stampedPdfLink.href = URL.createObjectURL(blob);
  });
});


