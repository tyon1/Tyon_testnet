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
    identityScreen.classList.add("hidden");
    uploadScreen.classList.remove("hidden");
  });

  /* -----------------------------------------
     SAMPLE FILE LOADING (PDF + JPG)
  --------------------------------------------*/
  const sampleSelector = document.getElementById("sampleSelector");

  const samplePDFs = [
    "TYON-SAMPLE-Certificate-Of-Authenticity.pdf",
    "TYON-SAMPLE-Certificate-Of-Product-Creation.pdf",
    "TYON-SAMPLE-Contract.pdf",
    "TYON-SAMPLE-Contract-2.pdf",
    "TYON-SAMPLE-Lease-Agreement.pdf",
    "TYON-SAMPLE-Service-Agreement.pdf",
    "TYON-SAMPLE-Employment-Contract.pdf",
    "TYON-SAMPLE-Voting-Card.pdf",
    "TYON-SAMPLE-Birth-Certificate.pdf",
  ];

  const sampleJPGs = [
    "JPG-SAMPLE-Artwork.jpg",
    "JPG-SAMPLE-Book-Manuscript.jpg",
    "JPG-SAMPLE-Document-Scan.jpg"
  ];

  samplePDFs.forEach(f => {
    const opt = document.createElement("option");
    opt.value = `sample_pdfs/${f}`;
    opt.textContent = f;
    sampleSelector.appendChild(opt);
  });

  sampleJPGs.forEach(f => {
    const opt = document.createElement("option");
    opt.value = `sample_jpgs/${f}`;
    opt.textContent = f;
    sampleSelector.appendChild(opt);
  });

  sampleSelector.addEventListener("change", () => {
    document.getElementById("filename").value =
      sampleSelector.options[sampleSelector.selectedIndex].text;

    document.getElementById("pageCount").value =
      sampleSelector.value.endsWith(".jpg") ? "1 (image)" : "1";
  });

  /* -----------------------------------------
      PDF + JPG DETECTION
  --------------------------------------------*/
  const pdfInput = document.getElementById("pdfFile");

  pdfInput.addEventListener("change", async () => {
    const file = pdfInput.files[0];
    if (!file) return;

    document.getElementById("filename").value = file.name;

    if (file.type.includes("jpeg") || file.type.includes("jpg")) {
      pageCount.value = "1 (image)";
      return;
    }

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    document.getElementById("pageCount").value = pdf.numPages;
  });

  /* -----------------------------------------
      SUBMISSION SIMULATION
  --------------------------------------------*/
  submitBtn.addEventListener("click", () => {
    const filename = document.getElementById("filename").value;
    const pages = document.getElementById("pageCount").value;
    const memo = document.getElementById("memo").value;

    const payload = {
      operator: "0.0.5073987",
      topic: "0.0.6607223",
      filename,
      pages,
      memo,
      syntheticSigner: "Alice Q. Validator",
      syntheticHash: "0x" + Math.random().toString(16).slice(2),
      ts: Date.now(),
      network: "tyon-testnet-simulated"
    };

    const encoded = btoa(JSON.stringify(payload));
    const blob = new Blob([encoded]);

    resultsBox.classList.remove("hidden");
    tyonId.textContent = filename;
    timestamp.textContent = pages;
    hashscanLink.href = "https://hashscan.io/testnet/topic/0.0.fake-topic";
    stampedPdfLink.href = URL.createObjectURL(blob);
  });
});
