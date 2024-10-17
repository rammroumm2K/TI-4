Voici la procédure détaillée pour afficher dynamiquement les informations provenant d'un fichier ou d'une variable JSON en JavaScript. Cette procédure sera divisée en plusieurs étapes, de la création du fichier JSON à l'affichage des informations sur la page web.

---

### **Étapes pour afficher des informations à partir d'un fichier ou d'une variable JSON**

### 1. **Préparer les données JSON**

Tout d'abord, les données des produits doivent être définies sous forme d'objet JSON. Ces données peuvent être stockées dans un fichier externe ou dans une variable JavaScript.

#### a) **Stocker les données dans un fichier JSON (optionnel)**

Si tu choisis d'utiliser un fichier JSON séparé, tu créeras un fichier nommé `produits.json` (par exemple). Ce fichier contiendra les informations de chaque produit sous forme de tableau d'objets.

##### **Exemple de fichier `produits.json` :**
```json
[
    {
        "id": 1,
        "nom": "T-shirt Blanc",
        "prix": 20,
        "description": "Un t-shirt confortable en coton.",
        "quantite": 10,
        "image": "tshirt_blanc.jpg"
    },
    {
        "id": 2,
        "nom": "Chaussures de sport",
        "prix": 50,
        "description": "Des chaussures légères pour la course.",
        "quantite": 5,
        "image": "chaussures_sport.jpg"
    }
]
```

#### b) **Stocker les données dans une variable JSON (option alternative)**

Une autre option est de stocker les informations des produits directement dans une variable JavaScript sous forme d'un tableau d'objets. Voici comment le faire :

##### **Exemple de variable `produits` :**
```javascript
const produits = [
    {
        id: 1,
        nom: "T-shirt Blanc",
        prix: 20,
        description: "Un t-shirt confortable en coton.",
        quantite: 10,
        image: "tshirt_blanc.jpg"
    },
    {
        id: 2,
        nom: "Chaussures de sport",
        prix: 50,
        description: "Des chaussures légères pour la course.",
        quantite: 5,
        image: "chaussures_sport.jpg"
    }
];
```

### 2. **Charger les données JSON**

#### a) **Charger les données depuis un fichier JSON (si nécessaire)**

Si les données sont stockées dans un fichier JSON externe, il est nécessaire de les charger à l'aide de la méthode `fetch()`.

##### Exemple de chargement via `fetch()` :
```javascript
fetch('produits.json')
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {
        afficherProduits(data); // Appeler une fonction pour afficher les produits
    })
    .catch(error => console.error('Erreur lors du chargement des produits:', error));
```

#### b) **Si les données sont dans une variable locale**

Si tu utilises une variable JSON locale, il n'y a pas besoin d'utiliser `fetch()`. Tu peux directement appeler la fonction qui va afficher les produits :

```javascript
afficherProduits(produits);
```

### 3. **Créer la fonction pour afficher les produits sur la page**

Cette fonction va parcourir les données JSON (que ce soit d'un fichier ou d'une variable) et créer dynamiquement des éléments HTML pour afficher chaque produit dans le catalogue.

#### a) **Structure HTML du catalogue**

Dans ton fichier HTML, tu devrais avoir un conteneur où les produits seront affichés :

```html
<div id="catalogue"></div>
```

#### b) **Fonction pour afficher les produits avec JavaScript**

Cette fonction va générer les éléments HTML nécessaires à l'affichage de chaque produit.

##### Exemple de fonction pour afficher les produits :
```javascript
function afficherProduits(produits) {
    const catalogue = document.getElementById('catalogue'); // Sélectionner le conteneur du catalogue
    catalogue.innerHTML = ''; // Vider le contenu existant

    // Parcourir chaque produit dans les données JSON
    produits.forEach(produit => {
        // Créer un élément div pour chaque produit
        const produitElement = document.createElement('div');
        produitElement.classList.add('product');

        // Remplir l'élément avec les informations du produit
        produitElement.innerHTML = `
            <img src="${produit.image}" alt="${produit.nom}">
            <h3>${produit.nom}</h3>
            <p>${produit.description}</p>
            <p>Prix : ${produit.prix}€</p>
            <p>Quantité restante : ${produit.quantite}</p>
            <button class="add-to-cart" data-id="${produit.id}">Ajouter au panier</button>
        `;

        // Ajouter l'élément produit au catalogue
        catalogue.appendChild(produitElement);
    });
}
```

### 4. **Ajouter des interactions au catalogue**

Ensuite, tu peux ajouter des événements interactifs, comme le bouton "Ajouter au panier". Chaque bouton aura un attribut `data-id` qui permettra de lier chaque produit à son ID dans le tableau JSON.

#### Exemple d'ajout d'interaction :
```javascript
// Ajouter des produits au panier lorsque l'utilisateur clique sur un bouton
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const produitId = event.target.getAttribute('data-id'); // Récupérer l'ID du produit
        ajouterAuPanier(produitId); // Appeler la fonction pour ajouter le produit au panier
    }
});
```

### 5. **Stockage des produits dans le panier**

Tu peux ensuite ajouter la logique pour stocker et mettre à jour le panier en fonction des sélections de l'utilisateur.

#### Exemple de fonction `ajouterAuPanier()` :
```javascript
let panier = [];

function ajouterAuPanier(produitId) {
    const produit = produits.find(p => p.id == produitId); // Trouver le produit correspondant à l'ID
    const produitExistant = panier.find(item => item.id == produitId); // Vérifier si le produit est déjà dans le panier

    if (produitExistant) {
        produitExistant.quantite++; // Si déjà présent, augmenter la quantité
    } else {
        panier.push({ ...produit, quantite: 1 }); // Sinon, ajouter le produit au panier
    }

    afficherPanier(); // Mettre à jour l'affichage du panier
}

function afficherPanier() {
    const panierElement = document.getElementById('cart-items');
    panierElement.innerHTML = ''; // Vider l'affichage précédent

    panier.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `<p>${item.nom} - ${item.prix}€ x ${item.quantite}</p>`;
        panierElement.appendChild(itemElement);
    });

    const total = panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);
    document.getElementById('total-price').textContent = total.toFixed(2);
}
```

---

### Récapitulatif de la procédure :
1. **Préparer les données JSON** : soit dans un fichier JSON, soit dans une variable JavaScript.
2. **Charger les données** : soit via `fetch()` (si fichier externe), soit directement depuis une variable.
3. **Afficher les produits** : créer une fonction pour parcourir les données JSON et afficher dynamiquement les produits sur la page.
4. **Ajouter des interactions** : ajouter des événements sur les boutons pour gérer des actions comme l'ajout au panier.
5. **Stockage et gestion du panier** : mettre à jour dynamiquement le contenu du panier et afficher le total des articles et le prix.

Cela permettra d'afficher et de manipuler des produits provenant de données JSON, en liant ces informations avec des interactions dynamiques sur la page.