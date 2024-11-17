// Seleziona tutti gli elementi <td>
let elements = document.getElementsByTagName("td");

// Crea un array vuoto per gli elementi con classi non vuote
let filteredElements = [];

// Itera su ciascun elemento <td>
for (let i = 0; i < elements.length; i++) {
  // Controlla se la classe non è vuota e non è "special" o "legend"
  if (
    elements[i].className !== "" &&
    elements[i].className !== "special" &&
    elements[i].className !== "legend" &&
    elements[i].className !== "specialLegend"
  ) {
    // Aggiungi l'elemento all'array filtrato
    filteredElements.push(elements[i]);

    // Aggiungi un evento di click per il reindirizzamento
    elements[i].addEventListener("click", function () {
      // Estrai il simbolo dall'elemento
      const symbol = elements[i].innerHTML.split("<br>")[1]; // Ottieni il simbolo dall'elemento
      // Reindirizza alla pagina dell'elemento
      window.location.href = "elements/html/" + symbol.toLowerCase() + ".html";
    });
  }
}

// Variabile globale per i dati
let datiElementi = [];

// Funzione per estrarre i dati degli elementi chimici dalla tabella, usando Promise
function estraiDatiElementi() {
  return new Promise((resolve, reject) => {
    const righe = document.querySelectorAll(".periodic-table tr");
    const datiTemporanei = [];

    righe.forEach((riga) => {
      const celle = riga.querySelectorAll("td");

      celle.forEach((cella) => {
        const contenuto = cella.innerHTML.trim();
        const righeContenuto = contenuto.split("<br>");

        if (righeContenuto.length === 4) {
          const number = parseInt(righeContenuto[0]);
          const symbol = righeContenuto[1];
          const elementName = righeContenuto[2];

          datiTemporanei.push({
            number,
            symbol,
            elementName,
          });
        }
      });
    });

    if (datiTemporanei.length > 0) {
      datiElementi = datiTemporanei; // Popola la variabile globale
      resolve(); // Risolve la Promise
    } else {
      reject("Nessun dato trovato");
    }
  });
}

// Funzione per cercare l'elemento
function cercaElemento() {

  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  if (searchInput === "") {
    alert(
      "Digita nel campo di ricerca il nome completo, il simbolo o il numero dell'elemento che vuoi cercare."
    );
    return;
  }

  const risultato = datiElementi.find(
    (element) =>
      element.symbol.toLowerCase() === searchInput ||
      element.elementName.toLowerCase() === searchInput ||
      element.number.toString() === searchInput
  );

  if (risultato) {
    console.log(`Elemento trovato:`, risultato);
    window.location.href = `elements/html/${risultato.symbol.toLowerCase()}.html`;
  } else {
    alert(
      "Elemento non trovato. Assicurati di digitare il nome esatto dell'elemento o la sua sigla."
    );
  }
}

const metals = document.getElementById("metalsLegendContainer");
const nonMetals = document.getElementById("nonMetalsLegendContainer");
const metalloids = document.getElementById("metalloidsLegendContainer");
const artificials = document.getElementById("artificialsLegendContainer");
const nobleGases = document.getElementById("nobelGasesLegendContainer");

let activeCategory = null; // Tiene traccia della categoria attiva

function adjustTransparency(targetClass) {
    const elements = document.querySelectorAll(".metal, .non-metal, .metalloid, .artificial, .noble-gas, .special, .specialLegend");

    if (activeCategory === targetClass) {
        // Se è già selezionata, ripristina tutto
        elements.forEach(element => {
            element.classList.remove("faded");
        });
        activeCategory = null; // Nessuna categoria attiva
    } else {
        // Altrimenti, applica la trasparenza
        elements.forEach(element => {
            if (element.classList.contains(targetClass)) {
                element.classList.remove("faded"); // Mostra gli elementi della categoria
            } else {
                element.classList.add("faded"); // Rende trasparenti gli altri
            }
        });
        activeCategory = targetClass; // Imposta la nuova categoria attiva
    }
}

// Eventi per ogni categoria
metals.addEventListener("click", () => adjustTransparency("metal"));
nonMetals.addEventListener("click", () => adjustTransparency("non-metal"));
metalloids.addEventListener("click", () => adjustTransparency("metalloid"));
artificials.addEventListener("click", () => adjustTransparency("artificial"));
nobleGases.addEventListener("click", () => adjustTransparency("noble-gas"));
