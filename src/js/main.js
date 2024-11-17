// Estrai i dati quando la pagina è pronta
window.addEventListener("load", function () {
  estraiDatiElementi()
    .then(() => {
      console.log("Dati estratti con successo!");
    })
    .catch((error) => {
      console.error("Errore durante l'estrazione dei dati:", error);
    });
});

// Seleziona tutti gli elementi <td>
let elements = document.getElementsByTagName("td");

// Crea un array vuoto per gli elementi con classi non vuote
let filteredElements = [];

// Itera su ciascun elemento <td>
for (let i = 0; i < elements.length; i++) {
  // Controlla se la classe non è vuota e non è "special" o "legend" o "specialLegend"
  if (
    elements[i].classList.length > 0 && // Aggiungiamo il controllo sulla lunghezza delle classi
    !elements[i].classList.contains("special") &&
    !elements[i].classList.contains("legend") &&
    !elements[i].classList.contains("specialLegend")
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

// Funzione per cercare l'elemento (rimane invariata)
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

// Evento per il bottone di ricerca
document
  .getElementById("search-button")
  .addEventListener("click", cercaElemento);

// Aggiungi un ascoltatore per l'evento 'keypress' sul campo di input
document
  .getElementById("search-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      cercaElemento(); // Esegui la funzione di ricerca
    }
  });

const metals = document.getElementById("metalsLegendContainer");
const nonMetals = document.getElementById("nonMetalsLegendContainer");
const metalloids = document.getElementById("metalloidsLegendContainer");
const artificials = document.getElementById("artificialsLegendContainer");
const nobleGases = document.getElementById("nobelGasesLegendContainer");
const lanthanides = document.querySelectorAll(".lanthanides");
const actinides = document.querySelectorAll(".actinides");

let activeCategory = null; // Tiene traccia della categoria attiva

function adjustTransparency(targetClass) {
  const elements = document.querySelectorAll(
    ".metal, .non-metal, .metalloid, .artificial, .noble-gas, .special, .specialLegend, .legend"
  );

  if (activeCategory === targetClass) {
    // Se è già selezionata, ripristina tutto
    elements.forEach((element) => {
      element.classList.remove("faded");
    });
    activeCategory = null; // Nessuna categoria attiva
  } else {
    // Altrimenti, applica la trasparenza
    elements.forEach((element) => {
      if (element.classList.contains(targetClass)) {
        element.classList.remove("faded"); // Mostra gli elementi della categoria
      } else {
        element.classList.add("faded"); // Rende trasparenti gli altri
      }
    });
    activeCategory = targetClass; // Imposta la nuova categoria attiva
  }
}
let activeCategoryRange = null; // Variabile per tracciare la categoria attiva

// Funzione per evidenziare una categoria specifica e gestire il toggle
function highlightCategoryRange(start, end, category) {
  const elements = document.querySelectorAll("td");

  // Se la categoria è già attiva, rimuovi la classe "faded" e resetta
  if (activeCategoryRange === category) {
    // Rimuovi la classe "faded" da tutti gli elementi
    elements.forEach((element) => {
      element.classList.remove("faded");
    });
    activeCategoryRange = null; // Resetta la categoria attiva
  } else {
    // Altrimenti evidenzia gli elementi nell'intervallo
    elements.forEach((element) => {
      const contenuto = element.innerHTML.trim();
      const righeContenuto = contenuto.split("<br>");

      if (righeContenuto.length >= 2) {
        const elementNumber = parseInt(righeContenuto[0]);

        if (elementNumber >= start && elementNumber <= end) {
          element.classList.remove("faded"); // Rimuovi la trasparenza
        } else {
          element.classList.add("faded"); // Aggiungi la trasparenza
        }
      }
    });
    activeCategoryRange = category; // Imposta la categoria attiva
  }
}

// Funzione per rimuovere la classe "faded" da tutti gli actinides
function removeFadedFromActinides() {
  const actinidesElements = document.querySelectorAll(".actinides");
  actinidesElements.forEach((element) => {
    element.classList.remove("faded"); // Rimuovi la classe "faded" da tutti gli actinides
  });
}

// Funzione per rimuovere la classe "faded" da tutti i lanthanides
function removeFadedFromLanthanides() {
  const lanthanidesElements = document.querySelectorAll(".lanthanides");
  lanthanidesElements.forEach((element) => {
    element.classList.remove("faded"); // Rimuovi la classe "faded" da tutti i lanthanides
  });
}

// Eventi per i Lantanoidi
lanthanides.forEach((lantanoide) => {
  lantanoide.addEventListener("click", function () {
    highlightCategoryRange(57, 71, "57-71"); // Evidenzia i Lantanoidi
    removeFadedFromLanthanides();
  });
});

// Eventi per gli Attinoidi
actinides.forEach((actinoide) => {
  actinoide.addEventListener("click", function () {
    // Evidenzia o deseleziona gli Attinoidi
    highlightCategoryRange(89, 103, "89-103"); // Evidenzia gli Attinoidi
    // Rimuovi "faded" dalla legenda degli attinoidi
    removeFadedFromActinides();
  });
});

// Eventi per ogni categoria
metals.addEventListener("click", () => adjustTransparency("metal"));
nonMetals.addEventListener("click", () => adjustTransparency("non-metal"));
metalloids.addEventListener("click", () => adjustTransparency("metalloid"));
artificials.addEventListener("click", () => adjustTransparency("artificial"));
nobleGases.addEventListener("click", () => adjustTransparency("noble-gas"));
