import { elementData } from "./main.js";
// Function to search for an element by name, symbol, or atomic number
function searchElement() {
  const searchValue = searchInput.value.toLowerCase().trim();
  if (!toggleSearchMode.checked) {
    if (searchValue === "") {
      alert(
        "Digita nel campo di ricerca il nome completo, il simbolo o il numero atomico dell'elemento che desideri cercare."
      );
      resultsModal.style.display = "none";
      return;
    }

    const result = elementData.find((element) =>
      [element.symbol, element.elementName, element.number.toString()].some(
        (val) => val.toLowerCase() === searchValue
      )
    );

    if (result) {
      window.sessionStorage.removeItem("currentElement");
      window.location.href = `elements/html/${result.symbol.toLowerCase()}.html`;
    } else {
      alert(
        "Elemento non trovato. Assicurati di digitare il nome esatto dell'elemento, il suo numero atomico o il suo simbolo correttamente."
      );
      resultsModal.style.display = "none";
    }
  }
}
const toggleSearchMode = document.getElementById("toggleSearchMode");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsModal = document.getElementById("results-modal");
const resultsContent = document.getElementById("results-content");
const closeModalButton = document.getElementById("close-modal");

let jsonData = []; // Dati JSON caricati

// Percorso del file JSON
const jsonFilePath = "./elements/assets/dataForSearch.json";

// Funzione per caricare i dati JSON
async function loadJson() {
  try {
    const response = await fetch(jsonFilePath);
    if (!response.ok) throw new Error("Impossibile caricare il file JSON.");
    jsonData = await response.json();
  } catch (error) {
    console.error("Errore durante il caricamento del JSON:", error.message);
    alert(
      "Errore durante il caricamento del file JSON. Controlla il percorso."
    );
  }
}

// Funzione per cercare nel file JSON
async function searchInJson(searchTerm) {
  if (!jsonData.length) {
    alert(
      "Il dati non sono stati caricati correttamente. Si prega di riprovare più tardi."
    );
    return [];
  }

  const matches = [];
  const searchTermEscaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const searchTermRegex = new RegExp(`\\b${searchTermEscaped}`, "i");

  // Cerca nel JSON
  for (const entry of jsonData) {
    if (searchTermRegex.test(entry.content)) {
      const lines = entry.content.split("\n"); // Dividi il contenuto in righe
      const matchedContexts = [];

      // Cerca tutte le righe con il termine e aggiungi il contesto
      for (let i = 0; i < lines.length; i++) {
        if (searchTermRegex.test(lines[i])) {
          const context = [
            lines[i - 2] || "", // Due righe prima (se esistono)
            lines[i - 1] || "", // Una riga prima (se esiste)
            lines[i].replace(
              searchTermRegex,
              (match) => `<mark>${match}</mark>`
            ), // Riga dell'occorrenza, evidenziata
            lines[i + 1] || "", // Una riga dopo (se esiste)
            lines[i + 2] || "", // Due righe dopo (se esistono)
          ]
            .map((line) => line.trim()) // Rimuovi spazi inutili
            .filter((line) => line.length > 0) // Rimuovi righe vuote
            .join("<br>"); // Combina con HTML break per leggibilità

          matchedContexts.push(context); // Aggiungi il contesto alla lista
        }
      }
      // Combina i contesti trovati
      if (matchedContexts.length > 0) {
        let sanitizedFile = entry.name.replace(/_/g, "").replace(".html", ""); // Rimuove gli underscore e il suffisso ".html"
        sanitizedFile =
          sanitizedFile.charAt(0).toUpperCase() + sanitizedFile.slice(1); // Metti la lettera iniziale in maiuscolo
        document.querySelectorAll("td").forEach((td) => {
          if (td.getAttribute("data-symbol") === sanitizedFile) {
            sanitizedFile = td.getAttribute("data-name");
          }
        });
        matches.push(`
          <pre>
            <strong><a href="./elements/html/${
              entry.name
            }">${sanitizedFile}</a></strong><br>
            ${matchedContexts.join("<br><hr class='dashed'><br>")}
          </pre>
          <br><hr class='normal'><br>
        `);
      }
    }
  }
  resultsModal.style.display = "block";
  return matches;
}

// Funzione principale di ricerca
async function handleSearch() {
  if (toggleSearchMode.checked) {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
      alert("Inserisci una parola o una frase da cercare.");
      resultsModal.style.display = "none";
      return;
    }
    if (/[<>&"']/.test(searchTerm)) {
      alert("Inserisci un termine di ricerca valido.");
      resultsModal.style.display = "none";
      return;
    }
    const matches = await searchInJson(searchTerm); // Attende il risultato della ricerca
    if (matches.length) {
      // Se ci sono occorrenze
      resultsContent.innerHTML = `<h2>Occorrenze trovate:</h2>${matches.join(
        "<br>"
      )}`;
      searchInput.blur();
    } else {
      // Se non ci sono occorrenze
      alert(`Nessuna occorrenza trovata per "${searchTerm}".`);
      resultsModal.style.display = "none";
      return;
    }
  } else {
    searchElement();
  }
}

// Listener per il tasto di ricerca
searchButton.addEventListener("click", handleSearch);

// Listener per ENTER nella casella di input
searchInput.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    await handleSearch(); // Avvia la ricerca
  }
});

// Chiusura della modale
closeModalButton.addEventListener("click", () => {
  resultsModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === resultsModal) {
    resultsModal.style.display = "none";
  }
});

// Cambia il placeholder in base alla modalità di ricerca
function addEventListenerToSwitch() {
  searchInput.placeholder = toggleSearchMode.checked
    ? "Cerca un'occorrenza negli approfondimenti..."
    : "Cerca per nome, simbolo o numero atomico...";

  toggleSearchMode.addEventListener("change", () => {
    searchInput.placeholder = toggleSearchMode.checked
      ? "Cerca un'occorrenza negli approfondimenti..."
      : "Cerca per nome, simbolo o numero atomico...";
  });
}

// Salva e ripristina la modalità di ricerca
document.addEventListener("DOMContentLoaded", async () => {
  await loadJson(); // Carica i dati JSON all'avvio della pagina
  addEventListenerToSwitch();

  // Salva la modalità di ricerca
  const savedSearchMode = localStorage.getItem("searchMode");
  if (savedSearchMode !== null) {
    toggleSearchMode.checked = savedSearchMode === "true";
    searchInput.placeholder = toggleSearchMode.checked
      ? "Cerca un'occorrenza negli approfondimenti..."
      : "Cerca per nome, simbolo o numero atomico...";
  }

  toggleSearchMode.addEventListener("change", () => {
    localStorage.setItem("searchMode", toggleSearchMode.checked);
  });
});