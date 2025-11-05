function participantTemplate(count) {
  return `
  <section class="participant${count}">
    <p>Participant ${count}</p>

    <div class="item">
      <label for="fname${count}"> First Name<span>*</span></label>
      <input id="fname${count}" name="fname${count}" type="text" required>
    </div>

    <div class="item activities">
      <label for="activity${count}">Activity #<span>*</span></label>
      <input id="activity${count}" name="activity${count}" type="text">
    </div>

    <div class="item">
      <label for="fee${count}">Fee ($)<span>*</span></label>
      <input id="fee${count}" name="fee${count}" type="number">
    </div>

    <div class="item">
      <label for="date${count}">Desired Date <span>*</span></label>
      <input id="date${count}" name="date${count}" type="date">
    </div>

    <div class="item">
      <p>Grade</p>
      <select name="grade${count}">
        <option selected value="" disabled></option>
        <option value="1">1st</option>
        <option value="2">2nd</option>
        <option value="3">3rd</option>
        <option value="4">4th</option>
        <option value="5">5th</option>
        <option value="6">6th</option>
        <option value="7">7th</option>
        <option value="8">8th</option>
        <option value="9">9th</option>
        <option value="10">10th</option>
        <option value="11">11th</option>
        <option value="12">12th</option>
      </select>
    </div>
  </section>`;
}

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

function successTemplate(info) {
  const { adultName, participantCount, totalFees } = info;
  const name = adultName.trim() || "Camper";
  const plural = participantCount !== 1 ? "s" : "";
  const dollars = totalFees.toFixed(2);

  return `Thank you ${name} for registering. You have registered ${participantCount} participant${plural} and owe $${dollars} in Fees.`;
}