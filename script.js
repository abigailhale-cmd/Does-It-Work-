const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const patientGrid = document.getElementById("patient-grid");
const donorGrid = document.getElementById("donor-grid");
const confirmBtn = document.getElementById("confirm-btn");
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");
const closeBtn = document.getElementById("close-btn");

let selectedPatient = null;
let selectedDonor = null;

/* Compatibility rules */
const compatibility = {
  "AB+": bloodTypes,
  "AB-": ["O-", "A-", "B-", "AB-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "A-": ["O-", "A-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "B-": ["O-", "B-"],
  "O+": ["O-", "O+"],
  "O-": ["O-"]
};

function createButtons(grid, isPatient) {
  bloodTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.classList.add("blood-btn");

    btn.onclick = () => {
      [...grid.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      if (isPatient) selectedPatient = type;
      else selectedDonor = type;

      if (selectedPatient && selectedDonor) {
        confirmBtn.style.display = "inline-block";
      }
    };

    grid.appendChild(btn);
  });
}

createButtons(patientGrid, true);
createButtons(donorGrid, false);

confirmBtn.onclick = () => {
  const isCompatible = compatibility[selectedPatient].includes(selectedDonor);

  if (isCompatible) {
    resultScreen.style.background = "#9cff57";
    resultText.style.color = "#1f5e00";
    resultText.textContent = "COMPATIBLE";
  } else {
    resultScreen.style.background = "#ff1f1f";
    resultText.style.color = "#7a0000";
    resultText.textContent = "NOT COMPATIBLE";
  }

  resultScreen.style.display = "block";
};

closeBtn.onclick = () => {
  location.reload();
};
