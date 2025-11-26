// Sandbox fake Hedera client
export function submitToHedera(payload) {
console.log("[SANDBOX] Hedera payload", payload);
return {
status: "SUCCESS",
consensusTimestamp: Date.now()
};
}