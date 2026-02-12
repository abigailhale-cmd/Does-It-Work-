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

/* Pair mapping for landscape layout */
const pairs = [["A+", "A-"], ["B+", "B-"], ["AB+", "AB-"], ["O+", "O-"]];

/* Create blood type buttons */
function createButtons(grid, isPatient) {
  bloodTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.classList.add("blood-btn");

    btn.onclick = () => {
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

      if (selectedPatient && selectedDonor) {
        confirmBtn.classList.add("show");
      }
    };

    grid.appendChild(btn);
  });

  grid.setAttribute('data-visible', 'false');
}

/* Initialize */
createButtons(patientGrid, true);
createButtons(donorGrid, false);

/* Toggle blood grids with proper animation & reset */
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = btn.nextElementSibling;
    const buttons = [...grid.children];
    const isVisible = grid.getAttribute('data-visible') === 'true';

    if (isVisible) {
      // Hide all buttons smoothly
      buttons.forEach((b, i) => {
        setTimeout(() => {
          b.style.transform = 'scale(0)';
          b.style.opacity = '0';
          b.classList.remove('selected');
        }, i * 50);
      });

      if (btn.textContent === "PATIENT") selectedPatient = null;
      else selectedDonor = null;

      confirmBtn.classList.remove("show");
      grid.setAttribute('data-visible', 'false');
      return;
    }

    // Show buttons with stagger
    buttons.forEach((b, i) => {
      setTimeout(() => {
        b.style.transform = 'scale(1)';
        b.style.opacity = '1';
      }, i * 100);
    });

    grid.setAttribute('data-visible', 'true');
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
closeBtn.onclick = () => location.reload();

/* Rearrange buttons in landscape as pairs */
function arrangePairs(grid) {
  if (window.innerHeight < window.innerWidth) { // landscape
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
    grid.style.gridTemplateRows = "repeat(4, auto)";
    
    // Put + and - of same blood type together
    pairs.forEach((pair, i) => {
      const first = [...grid.children].find(b => b.textContent === pair[0]);
      const second = [...grid.children].find(b => b.textContent === pair[1]);
      if (first && second) {
        grid.appendChild(first);
        grid.appendChild(second);
      }
    });
  } else {
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
    grid.style.gridTemplateRows = "auto";
  }
}

window.addEventListener("resize", () => {
  arrangePairs(patientGrid);
  arrangePairs(donorGrid);
});

// Initial arrangement
arrangePairs(patientGrid);
arrangePairs(donorGrid);
