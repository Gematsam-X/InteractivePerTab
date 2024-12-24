// Aggiungi un evento per eseguire l'estrazione dei dati quando la pagina è pronta
window.addEventListener("load", function () {
  estraiDatiElementi().catch((error) => {
    console.error("Errore durante l'estrazione dei dati:", error);
  });
});

// Seleziona tutti gli elementi <td>
let elements = document.getElementsByTagName("td");

// Crea un array vuoto per gli elementi con classi non vuote
let filteredElements = [];

// Itera su ciascun elemento <td>
function checkElementsClass() {
  for (let i = 0; i < elements.length; i++) {
    // Controlla se la classe non è vuota e non è "special", "legend", "no-border" o "specialLegend"
    if (
      elements[i].classList.length > 0 &&
      !elements[i].classList.contains("special") &&
      !elements[i].classList.contains("legend") &&
      !elements[i].classList.contains("specialLegend") &&
      !elements[i].classList.contains("no-border")
    ) {
      // Aggiungi l'elemento all'array filtrato
      filteredElements.push(elements[i]);

      // Aggiungi un evento di click per il reindirizzamento
      elements[i].addEventListener("click", function () {
        elements[i].style.transform = "scale(1.2)"; // Ingrandisce l'elemento al clic
        // Estrai il simbolo dall'elemento
        const symbol = elements[i].innerHTML.split("<br>")[1]; // Ottieni il simbolo dall'elemento
        // Reindirizza alla pagina dell'elemento
        window.sessionStorage.removeItem("currentElement");
        window.setTimeout(() => {
          resetDefaultStyle();
        }, 500);
        window.location.href =
          "elements/html/" + symbol.toLowerCase() + ".html";
      });
      areIntTransElemsHighlighted = false; // Reset the highlighting state
    }
  }
}

// Variabile globale per i dati
let datiElementi = [];

// Funzione per estrarre i dati degli elementi chimici dalla tabella, usando Promise
async function estraiDatiElementi() {
  const righe = document.querySelectorAll(".periodic-table tr");
  const datiTemporanei = [];

  for (let riga of righe) {
    const celle = riga.querySelectorAll("td");
    for (let cella of celle) {
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
    }
  }
  if (datiTemporanei.length > 0) {
    datiElementi = datiTemporanei;
  } else {
    throw new Error("Nessun dato trovato");
  }
}

// Funzione per cercare un elemento in base al nome, simbolo o numero atomico
function cercaElemento() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  // Se il campo di ricerca è vuoto, mostra un messaggio di errore
  if (searchInput === "") {
    alert(
      "Digita nel campo di ricerca il nome completo, il simbolo o il numero atomico dell'elemento che vuoi cercare."
    );
    return;
  }

  // Cerca l'elemento corrispondente
  const risultato = datiElementi.find((element) =>
    [element.symbol, element.elementName, element.number.toString()].some(
      (val) => val.toLowerCase() === searchInput
    )
  );

  // Se l'elemento è trovato, reindirizza alla sua pagina
  if (risultato) {
    window.sessionStorage.removeItem("currentElement");
    window.location.href = `elements/html/${risultato.symbol.toLowerCase()}.html`;
  } else {
    // Se l'elemento non è trovato, mostra un messaggio di errore
    alert(
      "Elemento non trovato. Assicurati di digitare il nome esatto dell'elemento, la sua sigla o il suo numero atomico correttamente."
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

// Definisci le categorie
const metals = document.getElementById("metalsLegendContainer");
const transitionMetals = document.getElementById(
  "transitionMetalsLegendContainer"
);
const internalTransitionMetals = document.getElementById(
  "internalTransitionMetalsLegendContainer"
);
const postTransitionMetals = document.getElementById(
  "postTransitionMetalsLegendContainer"
);
const alkaliMetals = document.getElementById("alkaliMetalsLegendContainer");
const alkalineEarthMetals = document.getElementById(
  "alkalineEarthMetalsLegendContainer"
);
const nonMetals = document.getElementById("nonMetalsLegendContainer");
const metalloids = document.getElementById("metalloidsLegendContainer");
const artificials = document.getElementById("artificialsLegendContainer");
const nobleGases = document.getElementById("nobleGasesLegendContainer");
const lanthanides = document.querySelectorAll(".lanthanides");
const actinides = document.querySelectorAll(".actinides");

let activeCategory = null; // Tiene traccia della categoria attiva

// Funzione per aggiungere o rimuovere la classe "faded" in base alla condizione
function toggleFaded(elements, condition) {
  elements.forEach((element) => {
    if (condition(element)) {
      element.classList.remove("faded");
    } else {
      element.classList.add("faded");
    }
  });
}

function resetDefaultStyle() {
  // Rimuovi la classe .faded da tutti gli elementi
  document.querySelectorAll("td").forEach((element) => {
    element.style.removeProperty("transform");
    element.style.removeProperty("opacity");
    element.classList.remove("faded");
  });

  // Svuota il sessionStorage
  window.sessionStorage.removeItem("currentElement");
}

let clickListenerAdded = false; // Indica se il listener è stato aggiunto

// Funzione principale per applicare la trasparenza agli elementi in base alla categoria
function adjustTransparency(targetClass) {
  const elements = document.querySelectorAll("td");

  // Se la categoria è già attiva (sta per essere disattivata)
  if (activeCategory === targetClass) {
    // Rimuovi l'ascoltatore dell'evento, dato che disattiviamo
    if (clickListenerAdded) {
      document.removeEventListener("click", handleOutsideClick);
      clickListenerAdded = false;
    }

    // Reset della classe "faded" sugli elementi
    resetDefaultStyle();
    areIntTransElemsHighlighted = false;
    activeCategory = null; // Resetta la categoria attiva
  } else {
    // Applica l'effetto "faded" alla categoria selezionata
    toggleFaded(elements, (element) => element.classList.contains(targetClass));
    activeCategory = targetClass; // Imposta la nuova categoria attiva

    // Aggiungi un listener per il clic fuori dalla tavola periodica
    if (!clickListenerAdded) {
      document.addEventListener("click", handleOutsideClick);
      clickListenerAdded = true; // Indica che l'ascoltatore è stato aggiunto
    }
  }
}

// Funzione per gestire il clic fuori dalla tavola e ripristinare gli stili predefiniti
function handleOutsideClick(event) {
  const elements = document.querySelectorAll("td");
  const clickedElement = event.target;

  // Verifica se il clic è all'interno degli elementi evidenziati
  const isInsideHighlighted = [...elements].some(
    (element) =>
      element.contains(clickedElement) && !element.classList.contains("faded")
  );

  // Se clicchi fuori, ripristina lo stile predefinito
  if (!isInsideHighlighted) {
    areIntTransElemsHighlighted = false; // Reset the highlighting state
    resetDefaultStyle();
    activeCategory = null; // Resetta la categoria attiva
  }
}
let activeCategoryRange = null; // Variabile per tracciare la categoria attiva

let areIntTransElemsHighlighted = false; // Indica se gli elementi di transizione interna sono evidenziati

// Funzione per evidenziare una categoria specifica e gestire il toggle
function highlightCategoryRange(category, series) {
  if (areIntTransElemsHighlighted) {
    return;
  } else {
    const allElements = document.querySelectorAll("td");

    if (activeCategoryRange === category) {
      // Se la categoria è già attiva, rimuoviamo 'faded' da tutti gli elementi
      allElements.forEach((element) => {
        element.classList.remove("faded");
      });
      activeCategoryRange = null; // Annulla la categoria attiva
      document.removeEventListener("click", handleOutsideClick); // Rimuovi l'ascoltatore dell'evento
      return; // Termina la funzione, niente più evidenza
    }

    // Aggiungi una classe 'faded' a tutti gli elementi
    allElements.forEach((element) => {
      element.classList.add("faded");
    });

    // Poi rimuovi 'faded' da quelli che appartengono alla categoria specificata
    const selectedElements = document.querySelectorAll(`.${series}`);
    selectedElements.forEach((element) => {
      element.classList.remove("faded"); // Rimuovi il 'faded' per la serie selezionata
    });

    activeCategoryRange = category; // Imposta la categoria come attiva
    document.addEventListener("click", handleOutsideClick); // Aggiungi l'ascoltatore dell'evento
  }
}

// Funzione per rimuovere la classe 'faded' da un gruppo specifico di elementi
function removeFadedFromCategory(categoryClass) {
  const categoryElements = document.querySelectorAll(categoryClass);
  categoryElements.forEach((element) => {
    element.classList.remove("faded"); // Rimuovi la classe 'faded' dal gruppo di elementi
  });
}

// Eventi per i Lantanoidi
lanthanides.forEach((lantanoide) => {
  lantanoide.addEventListener("click", function () {
    highlightCategoryRange("57-71", "lanthanid"); // Evidenzia i Lantanoidi
    removeFadedFromCategory(".lanthanides, .lanthanid"); // Rimuove 'faded' dai Lantanoidi
  });
});

// Eventi per gli Attinoidi
actinides.forEach((actinoide) => {
  actinoide.addEventListener("click", function () {
    highlightCategoryRange("89-103", "actinid"); // Evidenzia gli Attinoidi
    removeFadedFromCategory(".actinides, .actinid"); // Rimuove 'faded' dagli Attinoidi
  });
});

// Aggiungi eventi per ogni categoria per controllare la trasparenza
metals.addEventListener("click", () => {
  adjustTransparency("metal");
  removeFadedFromCategory(".lanthanides, .actinides");
});
internalTransitionMetals.addEventListener("click", () => {
  areIntTransElemsHighlighted = !areIntTransElemsHighlighted;
  adjustTransparency("internalTransitionMetal");
});
transitionMetals.addEventListener("click", () =>
  adjustTransparency("transitionMetal")
);
postTransitionMetals.addEventListener("click", () => {
  adjustTransparency("postTransitionMetal");
});
alkalineEarthMetals.addEventListener("click", () => {
  adjustTransparency("alkalineEarthMetal");
});

alkaliMetals.addEventListener("click", () => {
  adjustTransparency("alkaliMetal");
});
nonMetals.addEventListener("click", () => adjustTransparency("non-metal"));
metalloids.addEventListener("click", () => adjustTransparency("metalloid"));
artificials.addEventListener("click", () => adjustTransparency("artificial"));
nobleGases.addEventListener("click", () => adjustTransparency("noble-gas"));

//* Funzioni per il pulsante "Mostra nella tavola periodica"

// Gestisci la selezione dell'elemento corrente nella tavola periodica
const currentElementSymbol = window.sessionStorage.getItem("currentElement");

if (currentElementSymbol) {
  const allElements = document.querySelectorAll("td");

  allElements.forEach((element) => {
    const contenuto = element.innerHTML.trim();
    const righeContenuto = contenuto.split("<br>");

    // Verifica che righeContenuto[1] esista
    if (righeContenuto.length > 1) {
      const symbol = righeContenuto[1].toLowerCase();

      // Evidenzia solo l'elemento corrente
      if (symbol === currentElementSymbol.toLowerCase()) {
        element.classList.remove("faded");
        element.style.transform = "scale(1.2)";
      } else {
        element.classList.add("faded");
      }
    } else {
      // Gestisci elementi che non hanno un simbolo
      element.classList.add("faded");
    }
  });

  // Aggiungi l'event listener per il click
  document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const isInsideHighlighted = [...allElements].some(
      (element) =>
        element.contains(clickedElement) && !element.classList.contains("faded")
    );

    // Se si fa clic fuori dalla tavola periodica, ripristina lo stile predefinito
    if (!isInsideHighlighted) {
      resetDefaultStyle();
    }
  });
}

//* VISUALIZZAZIONE AVANZATA

// Stato della visualizzazione avanzata (attiva/disattiva)
let isAdvancedVisualizzation =
  JSON.parse(localStorage.getItem("isAdvancedVisualizzation")) || false;
// Elementi principali del DOM
const advancedVisualizzationButton = getCategoryCell("advancedVisualizzation"); // Bottone per visualizzazione avanzata
const metalsLegendContainerCell = getCategoryCell("metalsLegendContainer"); // Contenitore principale delle legende

// Selezione dei contenitori per categorie specifiche di metalli
const metalsCategoriesLegendContainer = [
  getCategoryCell("transitionMetalsLegendContainer"),
  getCategoryCell("alkalineEarthMetalsLegendContainer"),
  getCategoryCell("alkaliMetalsLegendContainer"),
  getCategoryCell("postTransitionMetalsLegendContainer"),
  getCategoryCell("internalTransitionMetalsLegendContainer"),
];

// Seleziona tutti gli elementi che devono essere nascosti quando attiviamo la visualizzazione avanzata
let removableElements = document.querySelectorAll(".removable");

// --- FUNZIONI UTILI ---

/**
 * Restituisce l'elemento DOM con un dato id
 * @param {string} category ID dell'elemento da selezionare
 * @returns {HTMLElement|null} Elemento trovato o null
 */
function getCategoryCell(category) {
  return document.querySelector(`#${category}`);
}

/**
 ** Funzione principale per attivare/disattivare la visualizzazione avanzata
 * @param {boolean} removeMetalClass Indica se rimuovere le classi dei metalli
 */
function toggleStatus(removeMetalClass) {
  localStorage.setItem(
    "isAdvancedVisualizzation",
    JSON.stringify(isAdvancedVisualizzation)
  );
  // Modifica il testo del bottone in base allo stato corrente
  advancedVisualizzationButton.innerText = isAdvancedVisualizzation
    ? "Disattiva visualizzazione avanzata"
    : "Attiva visualizzazione avanzata";

  if (isAdvancedVisualizzation) {
    // **Attivazione visualizzazione avanzata**
    metalsLegendContainerCell.classList.add("hidden"); // Nasconde il contenitore dei metalli generico
    metalsCategoriesLegendContainer.forEach((category) =>
      category.classList.remove("hidden")
    ); // Mostra contenitori per categorie specifiche

    // Aggiunge classi specifiche a lantanoidi e attinoidi
    document
      .querySelectorAll(".lanthanid, .actinid, .lanthanides, .actinides")
      .forEach((obj) => {
        obj.classList.add("internalTransitionMetal");
      });

    datiElementi.forEach((element) => {
      // Verifica che 'element.number' sia definito e che possa essere convertito in numero
      const numeroAtomico = parseInt(element.number);

      // Controlla che il numero atomico sia valido e inferiore a 112
      if (!isNaN(numeroAtomico) && numeroAtomico < 112) {
        if (element.number) {
          filteredElements.forEach((obj) => {
            let firstRow = obj.innerHTML.trim().split("<br>");
            // Verifica che l'elemento DOM esista
            if (
              (parseInt(firstRow) >= 21 && parseInt(firstRow) <= 30) ||
              (parseInt(firstRow) >= 39 && parseInt(firstRow) <= 48) ||
              (parseInt(firstRow) >= 72 && parseInt(firstRow) <= 80) ||
              (parseInt(firstRow) >= 104 && parseInt(firstRow) <= 112)
            ) {
              obj.classList.add("transitionMetal");
            }
            if (
              (parseInt(firstRow) == 3 ||
                parseInt(firstRow) == 11 ||
                parseInt(firstRow) == 19 ||
                parseInt(firstRow) == 37 ||
                parseInt(firstRow) == 55 ||
                parseInt(firstRow) == 87) &&
              !obj.classList.contains("group-period")
            ) {
              obj.classList.add("alkaliMetal");
            }
            if (
              (parseInt(firstRow) == 4 ||
                parseInt(firstRow) == 12 ||
                parseInt(firstRow) == 20 ||
                parseInt(firstRow) == 38 ||
                parseInt(firstRow) == 56 ||
                parseInt(firstRow) == 88) &&
              !obj.classList.contains("group-period")
            ) {
              obj.classList.add("alkalineEarthMetal");
            }
            if (
              (parseInt(firstRow) == 13 &&
                !obj.classList.contains("group-period")) ||
              parseInt(firstRow) == 31 ||
              parseInt(firstRow) == 49 ||
              parseInt(firstRow) == 50 ||
              (parseInt(firstRow) >= 81 && parseInt(firstRow) <= 83) ||
              (parseInt(firstRow) >= 113 && parseInt(firstRow) <= 116)
            ) {
              obj.classList.add("postTransitionMetal");
            }
          });
        } else {
          console.warn(
            `Elemento DOM non trovato per il numero atomico ${element.number}`
          );
        }
      }
    });

    // Nasconde gli elementi "rimovibili"
    removableElements.forEach((element) => element.classList.add("hidden"));
  } else {
    //** Disattivazione visualizzazione avanzata
    metalsLegendContainerCell.classList.remove("hidden"); // Mostra il contenitore principale

    // Nasconde i contenitori delle categorie specifiche
    metalsCategoriesLegendContainer.forEach((category) =>
      category.classList.add("hidden")
    );

    // Rimuove classi specifiche da lantanoidi e attinoidi
    if (removeMetalClass) {
      document.querySelectorAll(".internalTransitionMetal").forEach((obj) => {
        if (!obj.classList.contains("artificial"))
          obj.classList.remove("internalTransitionMetal");
        if (obj.id === "internalTransitionMetalsLegendContainer")
          obj.classList.add("internalTransitionMetal");

        if (
          obj.classList.contains("lanthanides") ||
          obj.classList.contains("actinides")
        ) {
          obj.classList.remove("no-click");
        }
      });

      document.querySelectorAll(".transitionMetal").forEach((obj) => {
        if (obj.id != "transitionMetalsLegendContainer")
          obj.classList.remove("transitionMetal");
      });

      document.querySelectorAll(".postTransitionMetal").forEach((obj) => {
        if (obj.id != "postTransitionMetalsLegendContainer")
          obj.classList.remove("postTransitionMetal");
      });

      document.querySelectorAll(".alkaliMetal").forEach((obj) => {
        if (obj.id != "alkaliMetalsLegendContainer")
          obj.classList.remove("alkaliMetal");
      });
      document.querySelectorAll(".alkalineEarthMetal").forEach((obj) => {
        if (obj.id != "alkalineEarthMetalsLegendContainer")
          obj.classList.remove("alkalineEarthMetal");
      });
    }

    // Mostra nuovamente gli elementi nascosti
    removableElements.forEach((element) => element.classList.remove("hidden"));
  }

  // Inverti lo stato della variabile globale
  isAdvancedVisualizzation = !isAdvancedVisualizzation;
}

// --- EVENT LISTENERS ---

/**
 * Event listener principale al caricamento del DOM:
 * 1. Estrae i dati e controlla le classi.
 * 2. Imposta la visualizzazione predefinita.
 */
document.addEventListener("DOMContentLoaded", () => {
  estraiDatiElementi(); // Estrae i dati
  checkElementsClass(); // Controlla le classi sugli elementi
  toggleStatus(false); // Configurazione visualizzazione iniziale
});

// Gestione del bottone per attivare/disattivare la visualizzazione avanzata
advancedVisualizzationButton.addEventListener("click", () =>
  toggleStatus(true)
);
