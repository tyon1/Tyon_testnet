import { fakeDelay } from "./utils.js";


const sampleSelect = document.getElementById("sampleSelect");
const useSampleBtn = document.getElementById("useSampleBtn");
const pdfUpload = document.getElementById("pdfUpload");
const memoField = document.getElementById("memo");
const processBtn = document.getElementById("processBtn");


async function loadSamples() {
const samples = [
"TYON-SAMPLE-Contract.pdf",
"TYON-SAMPLE-Contract-2.pdf",
"TYON-SAMPLE-Employment-Contract.pdf",
"TYON-SAMPLE-Lease-Agreement.pdf",
"TYON-SAMPLE-Service-Agreement.pdf",
"TYON-SAMPLE-Certificate-Of-Authenticity.pdf",
"TYON-SAMPLE-Certificate-Of-Product-Creation.pdf",
"TYON-SAMPLE-Birth-Certificate.pdf",
"TYON-SAMPLE-Voting-Card.pdf"
];


for (const f of samples) {
const opt = document.createElement("option");
opt.value = f;
opt.textContent = f;
sampleSelect.appendChild(opt);
}
}


loadSamples();


useSampleBtn.addEventListener("click", () => {
sessionStorage.setItem("selectedFile", sampleSelect.value);
sessionStorage.setItem("memo", memoField.value);
window.location.href = "results.html";
});


processBtn.addEventListener("click", () => {
const file = pdfUpload.files[0];
if (!file) return alert("No file selected");


sessionStorage.setItem("selectedFile", file.name);
sessionStorage.setItem("memo", memoField.value);
window.location.href = "results.html";
});