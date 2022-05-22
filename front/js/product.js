// Récupération de L'id (SearchParams)
const getproductId = () => {
  return new URL(location.href).searchParams.get("id");
};

//Requête vers l'API contenant les informations sur l'ensemble des produits
const productId = getproductId();
async function forproducts(productId) {
  const api = await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((api) => api.json())
    .then(function (data) {
      source = data;
    })
    // Fonction qui récupère les données de la promesse .then(data)
    .then(() => {
      // Ajout des données  dans la page HTML
      document.querySelector("head > title").textContent = source.name;
      document.querySelector(
        ".item__img"
      ).innerHTML += `<img src="${source.imageUrl}" alt="${source.altTxt}">`;
      document.getElementById("title").textContent += source.name;
      document.getElementById("price").textContent += source.price;
      document.getElementById("description").textContent += source.description;
      // Boucle pour ajouté les couleurs du produit dans le HTML
      for (let color of source.colors) {
        const productcolors = document.createElement("option");
        document.getElementById("colors").appendChild(productcolors);
        productcolors.value = color;
        productcolors.textContent = color;
      }
      return source;
    })
    .catch(function (err) {
      console.log("Erreur fetch" + err); //Gestion des erreurs
    });
  addBasket(productId);
}
forproducts(productId);

const color = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const basketBtn = document.getElementById("addToCart");

//Si les champs sont renseignés cela stock les données dans des variables

// appel au local storage si disponible
let productInStorage = JSON.parse(localStorage.getItem("produit"));
function addBasket() {
  // l'évènement s'éxecute seulement si les champs sont renseignés
  basketBtn.addEventListener("click", () => {
    if (color.value !== "" && quantity.value != 0 && quantity.value <= 100) {
      let userId = productId;
      let productColor = color.value;
      let productQty = quantity.value;
      let productArray = {
        userId: userId,
        productColor: productColor,
        productQty: productQty,
      };

      // Json.)arse cest pour convertir les données au format JSON qui sont dans le ls en obj js

      // si il n'y'a pas des produits dans le localStorage
      if (productInStorage == null) {
        productInStorage = [];
        productInStorage.push(productArray);
        localStorage.setItem("produit", JSON.stringify(productInStorage));
        alert("Parfait! le produit est enregistré");
      } else {
        // si il y'a déja des produits dans le local
        let foundProduct = productInStorage.find(
          (p) => p.userId === userId && p.productColor === productColor
        );
        // Si c'est vraie on additionne la quantité de l'objet du localStorage avec celle de la page en cours et on renvoie tout au localStorage

        if (foundProduct) {
          //on ajoute la quantité
          newQty = parseInt(foundProduct.productQty) + parseInt(productQty);
          foundProduct.productQty = newQty;
          // On l'enregistre dans le localStorage
          localStorage.setItem("produit", JSON.stringify(productInStorage));
          alert("Parfait! le produit est enregistré");
        } else {
          // Pour tous les autres cas possible, on ajoute un nouvel objet dans le localStorage
          productInStorage.push(productArray);
          localStorage.setItem("produit", JSON.stringify(productInStorage));
          alert("Parfait! le produit est enregistré");
        }
      }
    } else {
      alert(
        "Veuillez indiquez la quantité et la couleur du produit sélectionné"
      );
    }
  });
}
