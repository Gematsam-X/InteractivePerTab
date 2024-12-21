import { toggleButton } from "./theme.js";

// Array di immagini per ogni categoria
const categories = {
  metals: ["assets/legend/light/metals.png", "assets/legend/dark/metals.png"],
  nonMetals: [
    "assets/legend/light/non-metals.png",
    "assets/legend/dark/non-metals.png",
  ],
  nobleGases: [
    "assets/legend/light/noble-gases.png",
    "assets/legend/dark/noble-gases.png",
  ],
  metalloids: [
    "assets/legend/light/metalloids.png",
    "assets/legend/dark/metalloids.png",
  ],
  artificials: [
    "assets/legend/light/artificials.png",
    "assets/legend/dark/artificials.png",
  ],
  lens: ["assets/lens/light/lens.png", "assets/lens/dark/lens.png"],
  internalTransitionMetals: [
    "assets/legend/light/metals/internal-transition-metals.png",
    "assets/legend/dark/metals/internal-transition-metals.png",
  ],

  postTransitionMetals: [
    "assets/legend/light/metals/post-transition-metals.png",
    "assets/legend/dark/metals/post-transition-metals.png",
  ],
  transitionMetals: [
    "assets/legend/light/metals/transition-metals.png",
    "assets/legend/dark/metals/transition-metals.png",
  ],
  alkaliMetals: [
    "assets/legend/light/metals/alkali-metals.png",
    "assets/legend/dark/metals/alkali-metals.png",
  ],
  alkalineEarthMetals: [
    "assets/legend/light/metals/alkaline-earth-metals.png",
    "assets/legend/dark/metals/alkaline-earth-metals.png",
  ],
};

let index = 0; // Imposta l'indice a light di default

// Controlla se il tema è dark dal localStorage
if (localStorage.getItem("theme") === "dark") {
  index = 1; // Imposta le immagini in dark mode
}

// Funzione per cambiare tutte le immagini delle categorie
function cambiaImmagini() {
  for (const [category, images] of Object.entries(categories)) {
    const imgElement = document.getElementById(`${category}_img`);
    if (imgElement) {
      imgElement.src = images[index];
    }
  }
}

// Funzione che alterna tra le immagini light e dark
function toggleImages() {
  index = index === 0 ? 1 : 0; // Cambia indice tra light (0) e dark (1)
  cambiaImmagini(); // Aggiorna le immagini
}

if (toggleButton) {
  toggleButton.addEventListener("click", toggleImages);
}

// Imposta le immagini iniziali al caricamento della pagina
document.addEventListener("DOMContentLoaded", cambiaImmagini);
