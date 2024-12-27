const body = document.body;
body.classList.add("no-transition"); // Add a class to disable transitions initially

function showContentAfterDelay() {
  window.setTimeout(() => {
    document.body.classList.remove("no-transition"); // Remove the class to enable transitions after a delay
  }, 500);
}

export const toggleButton = document.querySelector(".theme-toggle");

// Check if the user has already set a theme (light or dark)
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-theme"); // Apply the dark theme if it was previously set
}

// Function to toggle the theme between light and dark
function toggleTheme() {
  body.style.transition = "background-color 0.5s ease"; // Add a transition effect for the background color
  body.classList.toggle("dark-theme"); // Toggle the dark theme class
  const theme = body.classList.contains("dark-theme") ? "dark" : "light"; // Determine the current theme
  localStorage.setItem("theme", theme); // Save the current theme to localStorage
}

if (toggleButton) {
  toggleButton.addEventListener("click", toggleTheme); // Add an event listener to the toggle button
}

window.addEventListener("DOMContentLoaded", () => {
  showContentAfterDelay(); // Show content after a delay when the DOM is fully loaded
});
