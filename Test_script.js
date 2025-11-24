document.addEventListener("DOMContentLoaded", () => {
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

  const pdfInput = document.getElementById("pdfFile");
  pdfInput.addEventListener("change", async () => {
    const file = pdfInput.files[0];
    if (!file) return;

    document.getElementById("filename").value = file.name;
    const pageCountField = document.getElementById("pageCount");
    pageCountField.value = "Detecting...";

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      pageCountField.value = pdf.numPages;
    } catch (err) {
      console.error("PDF.js error:", err);
      pageCountField.value = "N/A";
    }
  });

  document.getElementById("submitBtn").addEventListener("click", (e) => {
    e.preventDefault();

    const filename = document.getElementById("filename").value;
    const pages = document.getElementById("pageCount").value;
    const memo = document.getElementById("memo").value;

    const payload = {
      operator: "0.0.5073987",
      topic: "0.0.6607223",
      filename,
      pages,
      memo,
      ts: Date.now(),
      network: "testnet"
    };

    const encoded = btoa(JSON.stringify(payload));
    const blob = new Blob([encoded], { type: "text/plain" });

    document.getElementById("resultsBox").classList.remove("hidden");
    document.getElementById("tyonId").textContent = filename;
    document.getElementById("timestamp").textContent = pages;
    document.getElementById("hashscanLink").href =
      `https://hashscan.io/testnet/topic/0.0.6607223`;
    document.getElementById("stampedPdfLink").href = URL.createObjectURL(blob);
  });
});
