// Seleziona tutti gli elementi <td>
let elements = document.getElementsByTagName("td");

// Crea un array vuoto per gli elementi con classi non vuote
let filteredElements = [];

// Itera su ciascun elemento <td>
for (let i = 0; i < elements.length; i++) {
    // Controlla se la classe non è vuota e non è "special" o "legend"
    if (elements[i].className !== "" && elements[i].className !== "special" && elements[i].className !== "legend") {
        // Aggiungi l'elemento all'array filtrato
        filteredElements.push(elements[i]);
        
        // Aggiungi un evento di click per il reindirizzamento
        elements[i].addEventListener('click', function() {
            // Estrai il simbolo dall'elemento
            const symbol = elements[i].innerHTML.split('<br>')[1]; // Ottieni il simbolo dall'elemento
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
        const righe = document.querySelectorAll('.periodic-table tr');
        const datiTemporanei = [];

        righe.forEach(riga => {
            const celle = riga.querySelectorAll('td');

            celle.forEach(cella => {
                const contenuto = cella.innerHTML.trim();
                const righeContenuto = contenuto.split('<br>');

                if (righeContenuto.length === 4) {
                    const number = parseInt(righeContenuto[0]);
                    const symbol = righeContenuto[1];
                    const elementName = righeContenuto[2];

                    datiTemporanei.push({
                        number,
                        symbol,
                        elementName
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
    if (!Array.isArray(datiElementi) || datiElementi.length === 0) {
        console.error("Dati degli elementi non disponibili!");
        return;
    }

    const searchInput = document.getElementById("search-input").value.toLowerCase().trim();
    const risultato = datiElementi.find(element => 
        element.symbol.toLowerCase() === searchInput || 
        element.elementName.toLowerCase() === searchInput || 
        element.number.toString() === searchInput
    );

    if (risultato) {
        console.log(`Elemento trovato:`, risultato);
        window.location.href = `elements/html/${risultato.symbol.toLowerCase()}.html`;
    } else {
        alert("Elemento non trovato. Assicurati di digitare il nome esatto dell'elemento o la sua sigla.");
    }
}

// Esegui l’estrazione e poi assegna gli event listener
document.addEventListener("DOMContentLoaded", () => {
    estraiDatiElementi()
        .then(() => {
            // Aggiungi il listener per il clic del bottone
            document.getElementById("search-button").addEventListener("click", cercaElemento);

            // Aggiungi il listener per il tasto Invio nella barra di ricerca
            document.getElementById("search-input").addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    cercaElemento(); // Esegui la ricerca se premi "Enter"
                }
            });
        })
        .catch(error => console.error("Errore durante l'estrazione:", error));
});
