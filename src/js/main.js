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
