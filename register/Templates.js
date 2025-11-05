export function participantTemplate(count) {
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

export function successTemplate({ adultName, participantCount, totalFees }) {
  const name = (adultName || "").trim() || "Camper";
  const plural = participantCount !== 1 ? "s" : "";
  const dollars = Number(totalFees || 0).toFixed(2);

  return `Thank you ${name} for registering. You have registered ${participantCount} participant${plural} and owe $${dollars} in Fees.`;
}