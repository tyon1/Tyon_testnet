export function fakeDelay(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}


export function encodePayload(obj) {
return btoa(JSON.stringify(obj));
}


export function randomSigner() {
const names = ["Alice Q.", "Brandon V.", "Charlie K.", "Danielle R."];
return names[Math.floor(Math.random() * names.length)];
}