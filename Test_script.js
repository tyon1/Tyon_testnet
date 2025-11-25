document.addEventListener("DOMContentLoaded", () => {

  const elements = {
    userName: document.getElementById("userName"),
    companyName: document.getElementById("companyName"),
    proceedBtn: document.getElementById("proceedBtn"),
    identityScreen: document.getElementById("identityScreen"),
    uploadScreen: document.getElementById("uploadScreen"),
    docFile: document.getElementById("docFile"),
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

  // Enable Proceed Button
  function validateInputs() {
    const valid = elements.userName.value.trim() && elements.companyName.value.trim();
    elements.proceedBtn.disabled = !valid;
  }
  elements.userName.addEventListener("input", validateInputs);
  elements.companyName.addEventListener("input", validateInputs);

  elements.proceedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    elements.identityScreen.classList.add("hidden");
    elements.uploadScreen.classList.add("active");
  });

  // Handle PDFs & JPGs
  elements.docFile.addEventListener("change", async () => {
    const file = elements.docFile.files[0];
    if (!file) return;

    elements.filename.value = file.name;

    if (file.type === "application/pdf") {
      elements.pageCount.value = "Detecting...";
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        elements.pageCount.value = pdf.numPages;
      } catch {
        elements.pageCount.value = "N/A";
      }
    } else if (file.type.startsWith("image/")) {
      elements.pageCount.value = 1;
    }

    // Enable action buttons
    [elements.encryptBtn, elements.decryptBtn, elements.obfuscateBtn, elements.maskBtn, elements.copyBtn]
      .forEach(btn => btn.disabled = false);
  });

  // Submit (Sandbox)
  elements.submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const payload = {
      filename: elements.filename.value,
      pages: elements.pageCount.value,
      memo: elements.memo.value,
      ts: Date.now(),
      network: "testnet",
      type: elements.docFile.files[0]?.type
    };
    const encoded = btoa(JSON.stringify(payload));
    const blob = new Blob([encoded], { type: "text/plain" });

    elements.resultsBox.classList.remove("hidden");
    elements.tyonId.textContent = elements.filename.value;
    elements.timestamp.textContent = elements.pageCount.value;
    elements.hashscanLink.href = `https://hashscan.io/testnet/topic/0.0.6607223`;
    elements.stampedPdfLink.href = URL.createObjectURL(blob);
  });

});
