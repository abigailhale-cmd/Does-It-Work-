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

/* Create blood type buttons with toggle selection */
function createButtons(grid, isPatient) {
  bloodTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.classList.add("blood-btn");

    btn.onclick = () => {
      const currentlySelected = btn.classList.contains("selected");

      // Deselect if clicking the same button
      if (currentlySelected) {
        btn.classList.remove("selected");
        if (isPatient) selectedPatient = null;
        else selectedDonor = null;

        // Slide Confirm button down if visible
        confirmBtn.classList.remove("show");
        return;
      }

      // Otherwise, select this button
      [...grid.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      if (isPatient) selectedPatient = type;
      else selectedDonor = type;

      // Show Confirm button if both sides selected
      if (selectedPatient && selectedDonor) {
        confirmBtn.classList.add("show");
      }
    };

    grid.appendChild(btn);
  });
}

/* Initialize blood buttons */
createButtons(patientGrid, true);
createButtons(donorGrid, false);

/* Toggle blood grids when main buttons clicked */
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = btn.nextElementSibling;

    // Check if grid is currently visible
    const isVisible = Array.from(grid.children).some(b => b.style.opacity === '1');

    if (isVisible) {
      // Retract grid
      [...grid.children].forEach(b => {
        b.style.transform = 'scale(0)';
        b.style.opacity = '0';
        b.classList.remove('selected');
      });

      // Clear selections on this side
      if (btn.textContent === "PATIENT") selectedPatient = null;
      else selectedDonor = null;

      // Hide Confirm button
      confirmBtn.classList.remove("show");
      return;
    }

    // Otherwise, show grid with staggered animation
    const buttons = grid.children;
    for (let i = 0; i < buttons.length; i++) {
      setTimeout(() => {
        buttons[i].style.transform = 'scale(1)';
        buttons[i].style.opacity = '1';
      }, i * 100);
    }
  });
});

/* Confirm button logic */
confirmBtn.onclick = () => {
  const isCompatible = compatibility[selectedPatient].includes(selectedDonor);

  if (isCompatible) {
    resultScreen.style.background = "#9CFF57";
    resultText.style.color = "#1f5e00";
    resultText.textContent = "COMPATIBLE";
  } else {
    resultScreen.style.background = "#ff1f1f";
    resultText.style.color = "#7a0000";
    resultText.textContent = "NOT COMPATIBLE";
  }

  resultScreen.style.display = "block";
};

/* Close result screen */
closeBtn.onclick = () => {
  location.reload();
};
