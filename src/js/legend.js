import { themeToggleButton } from "./theme.js";
import { isDarkTheme } from "./theme.js";
import { isAdvancedView } from "./main.js";
import { advancedViewButton } from "./main.js";

// Array of images for each category
const categories = {
  metals: ["assets/legend/light/metals.webp", "assets/legend/dark/metals.webp"],
  nonMetals: [
    "assets/legend/light/non-metals.webp",
    "assets/legend/dark/non-metals.webp",
  ],
  nobleGases: [
    "assets/legend/light/noble-gases.webp",
    "assets/legend/dark/noble-gases.webp",
  ],
  metalloids: [
    "assets/legend/light/metalloids.webp",
    "assets/legend/dark/metalloids.webp",
  ],
  artificials: [
    "assets/legend/light/artificials.webp",
    "assets/legend/dark/artificials.webp",
  ],
  lens: ["assets/lens/light/lens.webp", "assets/lens/dark/lens.webp"],
  github: ["assets/github/light/github.webp", "assets/github/dark/github.webp"],
  internalTransitionMetals: [
    "assets/legend/light/metals/internal-transition-metals.webp",
    "assets/legend/dark/metals/internal-transition-metals.webp",
  ],
  postTransitionMetals: [
    "assets/legend/light/metals/post-transition-metals.webp",
    "assets/legend/dark/metals/post-transition-metals.webp",
  ],
  transitionMetals: [
    "assets/legend/light/metals/transition-metals.webp",
    "assets/legend/dark/metals/transition-metals.webp",
  ],
  alkaliMetals: [
    "assets/legend/light/metals/alkali-metals.webp",
    "assets/legend/dark/metals/alkali-metals.webp",
  ],
  alkalineEarthMetals: [
    "assets/legend/light/metals/alkaline-earth-metals.webp",
    "assets/legend/dark/metals/alkaline-earth-metals.webp",
  ],
  chalcogens: [
    "assets/legend/light/categories/chalcogens.webp",
    "assets/legend/dark/categories/chalcogens.webp",
  ],
  pnictogens: [
    "assets/legend/light/categories/pnictogens.webp",
    "assets/legend/dark/categories/pnictogens.webp",
  ],
  metalsAdvanced: [
    "assets/legend/light/metals_advanced.webp",
    "assets/legend/dark/metals_advanced.webp",
  ],
};

let index = 0; // Set the index to light mode by default

// Check if the theme is dark from localStorage
if (isDarkTheme) {
  index = 1; // Set the images to dark mode
}

// Function to change all category images
function updateImgs() {
  for (const [category, images] of Object.entries(categories)) {
    const imgElement = document.getElementById(`${category}_img`);
    if (imgElement) {
      if (imgElement.id === "metals_img") {
        updateMetalsImg();
      } else {
        imgElement.src = images[index]; // Update the image source based on the current index
      }
    }
  }
}

// Function to toggle between light and dark images
function toggleImages() {
  index = index === 0 ? 1 : 0; // Toggle index between light (0) and dark (1)
  updateImgs(); // Update the images
}

function updateMetalsImg() {
  const imgElement = document.getElementById(`metals_img`);
  if (isAdvancedView) {
    imgElement.src = categories.metals[index];
  } else {
    imgElement.src = categories.metalsAdvanced[index];
  }
}

// Add event listener to the toggle button if it exists
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleImages);
}

if (advancedViewButton) {
  advancedViewButton.addEventListener("click", updateMetalsImg);
}

// Set the initial images when the page loads
document.addEventListener("DOMContentLoaded", updateImgs);

window.addEventListener("load", updateMetalsImg);
