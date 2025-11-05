import { participantTemplate, successTemplate } from "./Templates.js";

const addButton = document.querySelector("#add");
let participantCount = 1;

addButton.addEventListener("click", () => {
    participantCount += 1
    const participantHtml = participantTemplate(participantCount);
    addButton.insertAdjacentHTML("beforebegin", participantHtml);
});

const form = document.querySelector("form");
const summary = document.querySelector("#summary");

form.addEventListener("submit", submitForm);

function submitForm(event) {
  event.preventDefault();

  const fees = totalFees();
  const participantCount = document.querySelectorAll('[id^="fee"]').length;
  const adultName = document.querySelector("#adult_name")?.value || "";

  form.style.display = "none";

  summary.textContent = successTemplate({
    adultName,
    participantCount,
    totalFees: fees
  });
}

function totalFees() {
  const feeInputs = document.querySelectorAll("[id^=fee]");

  let total = 0;

  feeInputs.forEach((input) => {
    const feeValue = parseFloat(input.value); 

    if (!Number.isNaN(feeValue)) {
      total += feeValue;
    }
  });

  return total;
}