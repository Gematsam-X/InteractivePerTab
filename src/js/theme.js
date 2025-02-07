const body = document.body;

export const themeToggleButton = document.querySelector(".theme-toggle");

// Check if the user has already set a theme (light or dark)
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-theme"); // Apply the dark theme if it was previously set
}

export const isDarkTheme = body.classList.contains("dark-theme") ? true : false; // Determine the current theme

// Function to toggle the theme between light and dark
function toggleTheme() {
  body.style.transition = "background-color 0.5s ease"; // Add a transition effect for the background color
  body.classList.toggle("dark-theme"); // Toggle the dark theme class
  const theme = body.classList.contains("dark-theme") ? "dark" : "light"; // Determine the current theme
  localStorage.setItem("theme", theme); // Save the current theme to localStorage
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme); // Add an event listener to the toggle button
}

document.querySelector("html").classList.add("theme-loaded"); // Add a class to the body to indicate that the theme has been loaded
