export default function showInPeriodicTable() {
  document
    .getElementById("showInPeriodicTableButton")
    .addEventListener("click", function showInPeriodicTable() {
      let currentLocation = window.location.pathname;

      let fileName = currentLocation.split("/").pop();

      let elementSymbol = fileName.replace(".html", "");

      localStorage.setItem("currentElement", elementSymbol);

      window.location.href = "/src/index.html";
    });
}
