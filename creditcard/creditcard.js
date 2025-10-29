function validateForm(event) {
  var errors = [];

  event.preventDefault();

  var number = document.getElementById("card-number");
  var holder = document.getElementById("card-holder");
  var month = document.getElementById("exp-month");
  var year = document.getElementById("exp-year");
  var cvc = document.getElementById("cvc");

  // Card Number
  if (number.value === "") {
    errors.push("Card number is required.");
  } else if (number.value.length < 15 || number.value.length > 16) {
    errors.push("Card number must be between 14 and 16 characters.");
  }

  // Card Holder
  if (holder.value === "") {
    errors.push("Card holder is required.");
  } else if (holder.value.length < 2 || holder.value.length > 40) {
    errors.push("Card holder must be between 2 and 40 characters.");
  }

  // Expiration Month
  if (month.value === "") {
    errors.push("Expiration month is required.");
  } else if (month.value.length !== 2) {
    errors.push("Expiration month must have 2 digits.");
  }

  // Expiration Year
  if (year.value === "") {
    errors.push("Expiration year is required.");
  } else if (year.value.length !== 2) {
    errors.push("Expiration year must have 2 digits.");
  }

  // CVC
  if (cvc.value === "") {
    errors.push("CVC is required.");
  } else if (cvc.value.length < 3 || cvc.value.length > 4) {
    errors.push("CVC must be 3 or 4 digits.");
  }

  // Show Errors
  var errorBox = document.querySelector(".errors");
  if (errors.length > 0) {
    var message = "";
    for (var i = 0; i < errors.length; i++) {
      message += "<p>" + errors[i] + "</p>";
    }
    errorBox.innerHTML = message;
  } else {
    errorBox.innerHTML = "";
    event.target.submit();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var form = document.querySelector(".card-form");
  form.addEventListener("submit", validateForm);
});