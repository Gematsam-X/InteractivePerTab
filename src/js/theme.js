document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".theme-toggle");
  const body = document.body;

  // Verifica se l'utente ha già impostato un tema (chiaro o scuro)
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
  }

  // Funzione di toggle per il cambio di tema
  toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    const theme = body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });
});
