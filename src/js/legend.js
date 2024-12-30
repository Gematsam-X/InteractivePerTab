import { toggleButton } from "./theme.js";

// Array of images for each category
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
  github: ["assets/github/light/github.png", "assets/github/dark/github.png"],
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
  chalcogens: [
    "assets/legend/light/categories/chalcogens.png",
    "assets/legend/dark/categories/chalcogens.png",
  ],
  pnictogens: [
    "assets/legend/light/categories/pnictogens.png",
    "assets/legend/dark/categories/pnictogens.png",
  ],
};

let index = 0; // Set the index to light mode by default

// Check if the theme is dark from localStorage
if (localStorage.getItem("theme") === "dark") {
  index = 1; // Set the images to dark mode
}

// Function to change all category images
function updateImgs() {
  for (const [category, images] of Object.entries(categories)) {
    const imgElement = document.getElementById(`${category}_img`);
    if (imgElement) {
      imgElement.src = images[index]; // Update the image source based on the current index
    }
  }
}

// Function to toggle between light and dark images
function toggleImages() {
  index = index === 0 ? 1 : 0; // Toggle index between light (0) and dark (1)
  updateImgs(); // Update the images
}

// Add event listener to the toggle button if it exists
if (toggleButton) {
  toggleButton.addEventListener("click", toggleImages);
}

// Set the initial images when the page loads
document.addEventListener("DOMContentLoaded", updateImgs);
