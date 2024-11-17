// Array di immagini per ogni categoria
const categories = {
  metals: ["assets/legend/light/metals.png", "assets/legend/dark/metals.png"],
  nonMetals: [
    "assets/legend/light/non-metals.png",
    "assets/legend/dark/non-metals.png",
  ],
  nobelGases: [
    "assets/legend/light/nobel-gases.png",
    "assets/legend/dark/nobel-gases.png",
  ],
  metalloids: [
    "assets/legend/light/metalloids.png",
    "assets/legend/dark/metalloids.png",
  ],
  artificials: [
    "assets/legend/light/artificials.png",
    "assets/legend/dark/artificials.png",
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

// Aggiungi l'evento click al pulsante con classe 'theme-toggle'
const toggleButton = document.querySelector(".theme-toggle");
if (toggleButton) {
  toggleButton.addEventListener("click", toggleImages);
}

// Imposta le immagini iniziali al caricamento della pagina
document.addEventListener("DOMContentLoaded", cambiaImmagini);
