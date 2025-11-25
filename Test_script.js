document.addEventListener("DOMContentLoaded", () => {

  // ========================
  // CONFIG (TESTNET)
  // ========================
  const OPERATOR_ID = "0.0.5073987";
  const TOPIC_ID = "0.0.6607223";
  const NETWORK = "testnet";

  // Elements
  const identityForm = document.getElementById("identityForm");
  const proceedBtn = document.getElementById("proceedBtn");

  const pdfInput = document.getElementById("pdfFile");
  const filenameField = document.getElementById("filename");
  const pageCountField = document.getElementById("pageCount");
  const memoField = document.getElementById("memo");

  const resultsBox = document.getElementById("resultsBox");
  const tyonIdField = document.getElementById("tyonId");
  const timestampField = document.getElementById("timestamp");
  const hashscanLink = document.getElementById("hashscanLink");
  const stampedPdfLink = document.getElementById("stampedPdfLink");

  // ========================
  // 1. Enable Proceed Button
  // ========================
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
  // 2. Parse PDF & detect page count
  // ========================
  pdfInput.addEventListener("change", async () => {
    const file = pdfInput.files[0];
    if (!file) return;

    filenameField.value = file.name;
    pageCountField.value = "Detecting...";

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      pageCountField.value = pdf.numPages;
    } catch (err) {
      console.error(err);
      pageCountField.value = "N/A";
    }
  });

  // ========================
  // 3. Stamp PDF (Option B)
  // ========================
  async function createStampedPDF(file, payload) {
    const arrayBuf = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuf);

    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

    const stamp = `
TYON TESTNET — SIMULATED SERIALIZATION ONLY
Filename: ${payload.filename}
Pages: ${payload.pages}
Timestamp: ${payload.ts}
Memo: ${payload.memo}
Operator: ${payload.operator}
Topic: ${payload.topic}
Network: ${payload.network}
(Not a legally binding serialization)
    `.trim();

    pages.forEach((page) => {
      page.drawText(stamp, {
        x: 40,
        y: page.getHeight() - 120,
        size: 10,
        font,
        color: PDFLib.rgb(0.8, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  }

  // ========================
  // 4. Submit Metadata (Fake Testnet Serialization)
  // ========================
  document.getElementById("submitBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const file = pdfInput.files[0];
    if (!file) return;

    const payload = {
      operator: OPERATOR_ID,
      topic: TOPIC_ID,
      filename: filenameField.value,
      pages: pageCountField.value,
      memo: memoField.value,
      ts: Date.now(),
      network: NETWORK
    };

    // Encode payload (fake Hedera message)
    const encoded = btoa(JSON.stringify(payload));

    // Create a stamped PDF
    const stampedBlob = await createStampedPDF(file, payload);

    // Generate download URL
    const stampedUrl = URL.createObjectURL(stampedBlob);

    // Display results
    resultsBox.classList.remove("hidden");
    tyonIdField.textContent = payload.filename;
    timestampField.textContent = payload.pages;
    hashscanLink.href = `https://hashscan.io/testnet/topic/${TOPIC_ID}`;
    stampedPdfLink.href = stampedUrl;
    stampedPdfLink.download = `TYON_TESTNET_${payload.filename}`;
  });

});

