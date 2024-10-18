document.addEventListener('DOMContentLoaded', () => {
    const catalogue = document.getElementById('catalogue');
    let panier = JSON.parse(localStorage.getItem('panier')) || []; // Carica il carrello dal localStorage o crea un array vuoto
    let jeux = []; // Lista dei giochi caricati dal JSON
    const panierSection = document.getElementById('panier');
    const carrelloPopup = document.getElementById('carrello-popup');
    const overlay = document.getElementById('overlay');
    const totalElement = document.getElementById('total'); // Elemento per il totale
    const formulaire = document.getElementById('formulaire-confirmation');
    const quantitePanier = document.getElementById('quantite-panier'); // Elemento per la quantità nel carrello
    // Funzione per aggiornare il localStorage con il contenuto del carrello
    function aggiornaLocalStorage() {
        localStorage.setItem('panier', JSON.stringify(panier));
    }
    // Aggiorna il conteggio degli articoli nel carrello
    function aggiornaQuantitaCarrello() {
        const totaleQuantita = panier.reduce((total, item) => total + item.quantite, 0);
        quantitePanier.innerText = totaleQuantita; // Aggiorna il numero visualizzato nello span
    }
    // Carica e mostra i giochi dal file JSON
    fetch('/assets/js/games.json')
        .then(response => response.json())
        .then(data => {
            jeux = data;
            jeux.forEach(jeu => {
                const jeuElement = document.createElement('div');
                jeuElement.classList.add('produit');
                jeuElement.innerHTML = `
 <h3>${jeu.name}</h3>
 <img src="${jeu.image}" alt="${jeu.name}" style="width:150px;height:200px;">
 <p>Plateforme: ${jeu.platform}</p>
 <p>Prix: ${jeu.price}€</p>
 <p>Quantité en stock: ${jeu.quantity}</p>
 <button onclick="ajouterAuPanier(${jeu.id})">Ajouter au panier</button>
                `;
                catalogue.appendChild(jeuElement);
            });
            afficherPanier(); // Mostra il carrello all'inizio
            aggiornaQuantitaCarrello(); // Aggiorna il conteggio degli articoli
        })
        .catch(error => console.error('Erreur lors du chargement des jeux :', error));
    // Funzione per aggiungere giochi al carrello
    window.ajouterAuPanier = (id) => {
        const jeu = jeux.find(p => p.id === id);
        const itemDansPanier = panier.find(p => p.id === jeu.id);
        if (itemDansPanier) {
            if (itemDansPanier.quantite < jeu.quantity) {
                itemDansPanier.quantite++;
            } else {
                mostrarModale("Désolé, il n'y a plus de stock disponible.");
            }
        } else {
            panier.push({ ...jeu, quantite: 1 });
        }
        aggiornaLocalStorage(); // Salva il carrello nel localStorage
        aggiornaQuantitaCarrello(); // Aggiorna il conteggio degli articoli nel carrello
        afficherPanier(); // Mostra il carrello
    };
    // Funzione per mostrare il contenuto del carrello
    function afficherPanier() {
        panierSection.innerHTML = '';
        let total = 0;
        if (panier.length === 0) {
            panierSection.innerHTML = '<h2>Votre Panier est vide</h2>';
            totalElement.innerHTML = '';
            return;
        }
        panier.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');
            articleElement.innerHTML = `
 <p>${article.name} (x${article.quantite}) - ${article.price * article.quantite}€</p>
 <button class="increase" onclick="augmenterQuantite(${article.id})">Augmenter</button>
 <button class="remove" onclick="retirerDuPanier(${article.id})">Retirer</button>
            `;
            total += article.price * article.quantite;
            panierSection.appendChild(articleElement);
        });
        const totalDisplay = document.createElement('div');
        totalDisplay.classList.add('total');
        totalDisplay.innerHTML = `<h3>Total: ${total}€</h3>`;
        panierSection.appendChild(totalDisplay);
    }
    // Funzione per aumentare la quantità di un articolo nel carrello
    window.augmenterQuantite = (id) => {
        const itemDansPanier = panier.find(p => p.id === id);
        const jeu = jeux.find(p => p.id === id);
        if (itemDansPanier && jeu) {
            if (jeu.quantity > itemDansPanier.quantite) {
                itemDansPanier.quantite++;
                aggiornaLocalStorage(); // Salva il carrello nel localStorage
                afficherPanier(); // Aggiorna il carrello
                aggiornaQuantitaCarrello(); // Aggiorna il conteggio degli articoli
            } else {
                mostrarModale('Désolé, vous ne pouvez pas augmenter la quantité, article en rupture de stock.');
            }
        }
    };
    // Funzione per rimuovere articoli dal carrello
    window.retirerDuPanier = (id) => {
        const index = panier.findIndex(p => p.id === id);
        if (index !== -1) {
            panier.splice(index, 1);
            aggiornaLocalStorage(); // Salva il carrello nel localStorage
            aggiornaQuantitaCarrello(); // Aggiorna il conteggio degli articoli
            afficherPanier(); // Mostra il carrello aggiornato
        }
    };
    // Validazione del modulo di conferma
    formulaire.addEventListener('submit', (e) => {
        e.preventDefault();
        const nom = document.getElementById('nom').value;
        const adresse = document.getElementById('adresse').value;
        if (nom && adresse) {
            mostrarModale('Commande confirmée pour ' + nom + ' à ' + adresse);
            panier.length = 0; // Svuota il carrello
            aggiornaLocalStorage(); // Pulisci il localStorage
            aggiornaQuantitaCarrello(); // Ripristina il conteggio degli articoli
            afficherPanier(); // Reimposta la visualizzazione del carrello
            carrelloPopup.style.display = 'none'; // Chiude il popup
            overlay.style.display = 'none'; // Chiude l'overlay
        } else {
            mostrarModale('Veuillez remplir tous les champs.');
        }
    });
    // Funzione per mostrare un modale
    function mostrarModale(messaggio) {
        const modale = document.createElement('div');
        modale.classList.add('modal');
        modale.innerHTML = `
 <div class="modal-content">
 <span class="close" id="close-modal">&times;</span>
 <p>${messaggio}</p>
 </div>
        `;
        document.body.appendChild(modale);
        const closeBtn = document.getElementById('close-modal');
        closeBtn.onclick = () => {
            modale.remove();
        };
        window.onclick = (event) => {
            if (event.target === modale) {
                modale.remove();
            }
        };
    }
    // Listener per chiudere il popup
    document.getElementById('close-popup').addEventListener('click', () => {
        carrelloPopup.style.display = 'none';
        overlay.style.display = 'none';
    });
    // Aggiungi l'evento per aprire il popup quando si fa clic sul carrello
    document.getElementById('carrello').addEventListener('click', () => {
        if (panier.length > 0) {
            carrelloPopup.style.display = 'block'; // Mostra il popup
            overlay.style.display = 'block'; // Mostra l'overlay
            afficherPanier(); // Mostra il contenuto del carrello
        } else {
            mostrarModale('Il tuo carrello è vuoto.'); // Messaggio se il carrello è vuoto
        }
    });
});
 
 