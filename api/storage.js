// Fake upload storage
export function storeDocument(file) {
console.log("[SANDBOX] stored file", file.name);
return "sandbox://storage/" + file.name;
}