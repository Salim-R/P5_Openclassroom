//Requête vers l'API contenant les informations sur l'ensemble des produits

async function products() {
  const api = await fetch("http://localhost:3000/api/products");

  return api;
}
//Passe l'objet en Json puis crée une boucle pour ajouter les différentes balises/classes
//pour préparer l'affichage des produits
function forproducts() {
  products()
    .then((api) => api.json())
    .then(function (data) {
      const source = data;
      for (let product of source) {
        document.getElementById(
          "items"
        ).innerHTML += `<a href="./product.html?id=${product._id}">
<article>
  <img src="${product.imageUrl}" alt="${product.altTxt}">
  <h3 class="productName">${product.name}</h3>
  <p class="productDescription">${product.description}</p>
</article> </a>`;
      }
    })
    //Gestion des erreurs
    .catch(function (err) {
      console.log("Erreur" + err);
    });
}
forproducts();
