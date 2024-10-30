// Seleziona il bottone per il cambio di tema
const toggleButton = document.querySelector('.theme-toggle');
const body = document.body;

// Seleziona tutte le immagini che cambiano in base al tema
const themeImages = document.querySelectorAll('.theme-image');

// Funzione per aggiornare le immagini in base al tema corrente
function updateImages(theme) {
    themeImages.forEach((img) => {
        // Ottiene l'attributo src attuale dell'immagine
        let currentSrc = img.getAttribute('src');
        
        // Sostituisce "light" con "dark" o viceversa
        let newSrc = theme === 'dark' 
            ? currentSrc.replace('light', 'dark') 
            : currentSrc.replace('dark', 'light');
        
        img.setAttribute('src', newSrc); // Aggiorna il percorso dell'immagine
    });
}

// Verifica se l'utente ha già impostato un tema (chiaro o scuro)
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    updateImages('dark'); // Imposta le immagini per il tema scuro
} else {
    updateImages('light'); // Imposta le immagini per il tema chiaro
}

// Funzione di toggle per il cambio di tema
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateImages(theme); // Aggiorna le immagini in base al nuovo tema
});