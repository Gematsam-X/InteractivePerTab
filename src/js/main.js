// Seleziona tutti gli elementi <td>
let elements = document.getElementsByTagName("td");

// Crea un array vuoto per gli elementi con classi non vuote
let filteredElements = [];

// Itera su ciascun elemento <td>
for (let i = 0; i < elements.length; i++) {
    // Controlla se la classe non è vuota e non è "special"
    if (elements[i].className !== "" && elements[i].className !== "special") {
        // Aggiungi l'elemento all'array filtrato
        filteredElements.push(elements[i]);

        // Aggiungi un evento di click per il reindirizzamento
        elements[i].addEventListener('click', function() {
            // Estrai il simbolo dall'elemento <td>
            const innerHTMLParts = elements[i].innerHTML.split('<br>'); 
            const symbol = innerHTMLParts.length > 1 ? innerHTMLParts[1] : ""; // Ottieni il simbolo solo se presente

            // Verifica se il simbolo esiste e reindirizza alla pagina corrispondente
            if (symbol) {
                window.location.href = "elements/html/" + symbol.toLowerCase() + ".html";
            }
        });
    }
}
