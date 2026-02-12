const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const patientGrid = document.getElementById("patient-grid");
const donorGrid = document.getElementById("donor-grid");
const confirmBtn = document.getElementById("confirm-btn");
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");
const closeBtn = document.getElementById("close-btn");

let selectedPatient = null;
let selectedDonor = null;

// Track if a grid is currently animating
let animatingGrid = null;

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
      if (animatingGrid) return; // Prevent selection during animation

      const currentlySelected = btn.classList.contains("selected");

      if (currentlySelected) {
        btn.classList.remove("selected");
        if (isPatient) selectedPatient = null;
        else selectedDonor = null;
        confirmBtn.classList.remove("show");
        return;
      }

      [...grid.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      if (isPatient) selectedPatient = type;
      else selectedDonor = type;

      if (selectedPatient && selectedDonor) confirmBtn.classList.add("show");
    };

    grid.appendChild(btn);
  });

  grid.setAttribute('data-visible', 'false');
}

/* Initialize grids */
createButtons(patientGrid, true);
createButtons(donorGrid, false);

/* Toggle blood grids */
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = btn.nextElementSibling;
    const isVisible = grid.getAttribute('data-visible') === 'true';

    if (animatingGrid) return; // Ignore clicks while animating

    if (isVisible) {
      // Retract grid
      animatingGrid = grid;
      const buttons = [...grid.children];
      buttons.reverse().forEach((b, i) => {
        setTimeout(() => {
          b.style.transform = 'scale(0)';
          b.style.opacity = '0';
          b.classList.remove('selected');
          if (i === buttons.length - 1) {
            grid.setAttribute('data-visible', 'false');
            animatingGrid = null;
            if (btn.textContent === "PATIENT") selectedPatient = null;
            else selectedDonor = null;
            confirmBtn.classList.remove("show");
          }
        }, i * 100);
      });
      return;
    }

    // Show grid with staggered animation
    animatingGrid = grid;
    const buttons = grid.children;
    for (let i = 0; i < buttons.length; i++) {
      setTimeout(() => {
        buttons[i].style.transform = 'scale(1)';
        buttons[i].style.opacity = '1';
        if (i === buttons.length - 1) animatingGrid = null;
      }, i * 100);
    }
    grid.setAttribute('data-visible', 'true');
  });
});

/* Confirm button */
confirmBtn.onclick = () => {
  if (!selectedPatient || !selectedDonor) return;
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
