// Aggiungi un evento per eseguire l'estrazione dei dati quando la pagina è pronta
window.addEventListener("load", function () {
  estraiDatiElementi()
    .then(() => {
      console.log("Dati estratti con successo!");
    })
    .catch((error) => {
      console.error("Errore durante l'estrazione dei dati:", error);
    });
});

// Disabilita temporaneamente le transizioni
document.body.classList.add("no-transition");

// Rimuove la classe "no-transition" dopo 100 millisecondi per abilitare le transizioni
window.setTimeout(() => {
  document.body.classList.remove("no-transition");
}, 100);

// Seleziona tutti gli elementi <td>
let elements = document.getElementsByTagName("td");

// Crea un array vuoto per gli elementi con classi non vuote
let filteredElements = [];

// Itera su ciascun elemento <td>
for (let i = 0; i < elements.length; i++) {
  // Controlla se la classe non è vuota e non è "special", "legend" o "specialLegend"
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
      elements[i].style.transform = "scale(1.2)"; // Ingrandisce l'elemento al clic
      // Estrai il simbolo dall'elemento
      const symbol = elements[i].innerHTML.split("<br>")[1]; // Ottieni il simbolo dall'elemento
      // Reindirizza alla pagina dell'elemento
      window.sessionStorage.removeItem("currentElement");
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

    // Itera sulle righe della tabella
    righe.forEach((riga) => {
      const celle = riga.querySelectorAll("td");

      // Itera su ciascuna cella della riga
      celle.forEach((cella) => {
        const contenuto = cella.innerHTML.trim();
        const righeContenuto = contenuto.split("<br>");

        // Se il contenuto ha 4 righe, estrai i dati
        if (righeContenuto.length === 4) {
          const number = parseInt(righeContenuto[0]);
          const symbol = righeContenuto[1];
          const elementName = righeContenuto[2];

          // Aggiungi i dati estratti all'array temporaneo
          datiTemporanei.push({
            number,
            symbol,
            elementName,
          });
        }
      });
    });

    // Se i dati sono stati trovati, salva nella variabile globale e risolvi la Promise
    if (datiTemporanei.length > 0) {
      datiElementi = datiTemporanei; // Popola la variabile globale
      resolve(); // Risolve la Promise
    } else {
      reject("Nessun dato trovato");
    }
  });
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
  const risultato = datiElementi.find(
    (element) =>
      element.symbol.toLowerCase() === searchInput ||
      element.elementName.toLowerCase() === searchInput ||
      element.number.toString() === searchInput
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
const nonMetals = document.getElementById("nonMetalsLegendContainer");
const metalloids = document.getElementById("metalloidsLegendContainer");
const artificials = document.getElementById("artificialsLegendContainer");
const nobleGases = document.getElementById("nobelGasesLegendContainer");
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

// Funzione per applicare la trasparenza agli elementi in base alla categoria
function adjustTransparency(targetClass) {
  const elements = document.querySelectorAll(
    ".metal, .non-metal, .metalloid, .artificial, .noble-gas, .special, .specialLegend, .legend"
  );
  if (activeCategory === targetClass) {
    toggleFaded(elements, () => true); // Mostra tutto
    activeCategory = null;
  } else {
    toggleFaded(elements, (element) => element.classList.contains(targetClass));
    activeCategory = targetClass;
  }
}

let activeCategoryRange = null; // Variabile per tracciare la categoria attiva

// Funzione per evidenziare una categoria specifica e gestire il toggle
function highlightCategoryRange(start, end, category) {
  const elements = document.querySelectorAll("td");

  // Se la categoria è già attiva, rimuovi la classe "faded" e resetta
  if (activeCategoryRange === category) {
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
    highlightCategoryRange(89, 103, "89-103"); // Evidenzia gli Attinoidi
    removeFadedFromActinides();
  });
});

// Eventi per ogni categoria
metals.addEventListener("click", () => adjustTransparency("metal"));
nonMetals.addEventListener("click", () => adjustTransparency("non-metal"));
metalloids.addEventListener("click", () => adjustTransparency("metalloid"));
artificials.addEventListener("click", () => adjustTransparency("artificial"));
nobleGases.addEventListener("click", () => adjustTransparency("noble-gas"));

// Funzioni per il pulsante "Mostra nella tavola periodica"

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

  function resetDefaultStyle() {
    // Rimuovi la classe .faded da tutti gli elementi
    allElements.forEach((element) => {
      element.style.removeProperty("transform");
      element.style.removeProperty("opacity");
      element.classList.remove("faded");
    });

    // Svuota il sessionStorage
    window.sessionStorage.removeItem("currentElement");
  }

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