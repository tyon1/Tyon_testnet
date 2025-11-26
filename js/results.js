import { randomSigner } from "./utils.js";


const fname = sessionStorage.getItem("selectedFile");
const memo = sessionStorage.getItem("memo");
const signer = randomSigner();


const pages = 1 + Math.floor(Math.random() * 5);
const timestamp = new Date().toLocaleString();


// Fill UI
r_filename.textContent = fname;
r_pages.textContent = pages;
r_signer.textContent = signer;
r_timestamp.textContent = timestamp;


// HashScan fake link
hashscanLink.href = "https://hashscan.io/testnet/topic/0.0.6607223";


// Fake stamped PDF
const encoded = btoa(`Document: ${fname}\nMemo: ${memo}\nSigner: ${signer}`);
const blob = new Blob([encoded], { type: "text/plain" });
downloadLink.href = URL.createObjectURL(blob);
downloadLink.download = fname + "-TyonStamped.txt";