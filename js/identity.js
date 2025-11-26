const nameField = document.getElementById("userName");
const companyField = document.getElementById("companyName");
const proceedBtn = document.getElementById("proceedBtn");


function checkReady() {
proceedBtn.disabled = !(nameField.value.trim() && companyField.value.trim());
}


nameField.addEventListener("input", checkReady);
companyField.addEventListener("input", checkReady);


proceedBtn.addEventListener("click", (e) => {
e.preventDefault();
sessionStorage.setItem("userName", nameField.value.trim());
sessionStorage.setItem("companyName", companyField.value.trim());
window.location.href = "upload.html";
});