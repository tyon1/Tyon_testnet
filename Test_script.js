document.addEventListener("DOMContentLoaded", () => {
  const identityForm = document.getElementById("identityForm");
  const proceedBtn = document.getElementById("proceedBtn");

  // ✅ Enable Proceed Button
  function validateInputs() {
    const name = document.getElementById("userName").value.trim();
    const company = document.getElementById("companyName").value.trim();
    proceedBtn.disabled = !(name && company);
  }
  document.getElementById("userName").addEventListener("input", validateInputs);
  document.getElementById("companyName").addEventListener("input", validateInputs);

  // ✅ Proceed to Upload
  identityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("identityScreen").classList.remove("active");
    document.getElementById("identityScreen").classList.add("hidden");
    document.getElementById("uploadScreen").classList.add("active");
  });

  // ✅ Upload Toggle
  const singleBtn = document.getElementById("singleBtn");
  const bulkBtn = document.getElementById("bulkBtn");
  const singleForm = document.getElementById("singleForm");
  const bulkForm = document.getElementById("bulkForm");

  singleBtn.addEventListener("click", () => {
    singleForm.classList.remove("hidden");
    bulkForm.classList.add("hidden");
    singleBtn.classList.add("active");
    bulkBtn.classList.remove("active");
  });
  bulkBtn.addEventListener("click", () => {
    bulkForm.classList.remove("hidden");
    singleForm.classList.add("hidden");
    bulkBtn.classList.add("active");
    singleBtn.classList.remove("active");
  });

  // ✅ Single PDF Handling
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
      console.error(err);
      pageCountField.value = "N/A";
    }

    // Enable action buttons
    ["encryptBtn","decryptBtn","obfuscateBtn","maskBtn","copyBtn"].forEach(id => {
      document.getElementById(id).disabled = false;
    });
  });

  // ✅ Submit Sandbox Metadata
  document.getElementById("singleForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const filename = document.getElementById("filename").value;
    const pages = document.getElementById("pageCount").value;
    const memo = document.getElementById("memo").value;

    const payload = { filename, pages, memo, network:"sandbox" };
    const encoded = btoa(JSON.stringify(payload));
    const blob = new Blob([encoded], { type: "text/plain" });

    // Show results
    const resultsBox = document.getElementById("resultsBox");
    resultsBox.classList.remove("hidden");
    document.getElementById("tyonId").textContent = filename;
    document.getElementById("timestamp").textContent = pages;
    document.getElementById("hashscanLink").href = "#sandbox";
    document.getElementById("stampedPdfLink").href = URL.createObjectURL(blob);
  });

});

