export default function showInPeriodicTable() {
  document
    .getElementById("showInPeriodicTableButton")
    .addEventListener("click", function showInPeriodicTable() {
      let currentElementSymbol = window.location.pathname
        .split("/")
        .pop()
        .replace(".html", "");

      sessionStorage.setItem("currentElement", currentElementSymbol);

      window.location.href = "../../index.html";
    });
}
