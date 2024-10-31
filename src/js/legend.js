// Oggetto che contiene le immagini dei vari gruppi di elementi
const images = {
    metals: {
        dark: "../assets/legend/dark/metals.png",
        light: "../assets/legend/light/metals.png"
    },
    metalloids: {
        dark: "../assets/legend/dark/metalloids.png",
        light: "../assets/legend/light/metalloids.png"        
    },
    artificials: {
        dark: "../assets/legend/dark/artificials.png",
        light: "../assets/legend/light/artificials.png"
    },
    nonMetals: {
        dark: "../assets/legend/dark/non-metals.png",
        light: "../assets/legend/light/non-metals.png"
    },
    nobelGases: {
        dark: "../assets/legend/dark/nobel-gases.png",
        light: "../assets/legend/light/nobel-gases.png"
    },
};

// Recupera il tema corrente dal localStorage
let currentTheme = localStorage.getItem('theme');

// Se il tema non è impostato, usa un tema di default (es. 'light')
if (!currentTheme) {
    currentTheme = 'light'; // Imposta il tema di default
}

// Ottieni il bottone per il toggle del tema
const toggleButton = document.getElementById("theme-toggle");

// Assicurati di usare una stringa per l'ID dell'immagine
let metalsImg = document.getElementById("metals_img");

// Aggiungi un evento al bottone per cambiare l'immagine in base al tema
toggleButton.addEventListener('click', () => {
    // Cambia la sorgente dell'immagine in base al tema corrente
    metalsImg.src = images.metals[currentTheme];
});