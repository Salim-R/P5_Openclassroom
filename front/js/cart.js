//Récupération des produits de l'Api
async function forproducts(productId) {
  const api = await fetch("http://localhost:3000/api/products/" + productId)
    .then((api) => api.json())
    .then(function (data) {
      source = data;
    })
    .catch(function (err) {
      console.log("Erreur fetch" + err);
    });
  return source;
}

let productInStorage = JSON.parse(localStorage.getItem("produit"));
let structureHtml = [];

// Affichage du panier
async function displayBasket() {
  // Si le localStorage est plein
  for (i = 0; i < productInStorage.length; i++) {
    const source = await forproducts(productInStorage[i].userId);
    const totalPriceProducts = productInStorage[i].productQty * source.price;
    structureHtml += `<article class="cart__item" data-id="${productInStorage[i].userId}" data-color="${productInStorage[i].productColor}">
                    <div class="cart__item__img">
                        <img src="${source.imageUrl}" alt="${source.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${source.name}</h2>
                            <p>${productInStorage[i].productColor}</p>
                            <p>Prix unitaire: ${source.price}€</p>
                        </div>
                        <div class="cart__item__content__settings">
                          <div class="cart__item__content__settings__quantity">
                              <p id="quantité">
                                Qté : <input data-id= "${productInStorage[i].userId}" data-color= "${productInStorage[i].productColor}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${productInStorage[i].productQty}>
                              </p>
                              <p id="sousTotal">Prix total pour cet article: ${totalPriceProducts}€</p> 
                          </div>
                          <div class="cart__item__content__settings__delete">
                            <p data-id= ${productInStorage[i].userId} data-color= ${productInStorage[i].productColor} class="deleteItem">Supprimer</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    </article>`;
  }
  // Si le localstorage est vide
  if (productInStorage === null || productInStorage === 0) {
    document.getElementById("cart__items").textContent =
      "Votre panier est vide !";
  }
  // Affichage de la somme totale
  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < productInStorage.length; i++) {
    totalQuantity += parseInt(productInStorage[i].productQty);
    totalPrice += parseInt(source.price * productInStorage[i].productQty);
  }

  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalPrice").textContent = totalPrice;

  // affichage du nombre total d'articles dans le panier
  if (i == productInStorage.length) {
    document.getElementById("cart__items").innerHTML = structureHtml;
    deleteProduct();
    changeQuantity();
  }
}
displayBasket();

// Supprimer un produit
function deleteProduct() {
  const btn_delete = document.querySelectorAll(".deleteItem");
  btn_delete.forEach((btn_delete) => {
    btn_delete.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");
      productInStorage = productInStorage.filter(
        (el) => !(el.userId == deleteId && el.productColor == deleteColor)
      );
      console.log(productInStorage);
      // Mise à jour du localStorage
      localStorage.setItem("produit", JSON.stringify(productInStorage));
      // Refresh de la page Panier
      location.reload();
      alert("L'article a bien été supprimé du panier.");
    });
  });
}

//  Modifier sa quantité
function changeQuantity() {
  const quantityPosition = document.querySelectorAll(".itemQuantity");
  quantityPosition.forEach((quantityPosition) => {
    quantityPosition.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let productInStorage = localStorage.getItem("produit");
      let product = JSON.parse(productInStorage);

      product = product.map((produit) => {
        if (produit.userId === dataId && produit.productColor === dataColor) {
          produit.productQty = inputValue;
        }
        return produit;
      });
      // Maj localStorage
      let productrefresh = JSON.stringify(product);
      localStorage.setItem("produit", productrefresh);
      // Refresh de la page
      location.reload();
    });
  });
}

// formulaire //
const validate_Btn = document.getElementById("order");

// Evenement au  click pour pouvoir valider le formulaire
validate_Btn.addEventListener("click", (event) => {
  event.preventDefault();
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  console.log(contact);

  // regex champ Nom/Prénom
  const firstAndLastNameRegEx = (value) => {
    return /^[a-z-A-Z]{3,10}$/.test(value);
  };
  // Regex du champ Adresse
  const adresseRegEx = (value) => {
    return /([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)$/.test(value);
  };
  // Regex du champ Ville
  const cityRegEx = (value) => {
    return /^[a-z-A-Z]{1,45}$/.test(value);
  };

  // Regex du champ Email
  const emailRegEx = (value) => {
    return /(\S[^\.]*)(\.(\S*))?@(\S*)/gi.test(value);
  };
  // Fonctions de Vérification du champ Prénom:
  function checkedFirstName() {
    const valuePrenom = contact.firstName;
    let inputFirstName = document.getElementById("firstName");
    if (firstAndLastNameRegEx(valuePrenom)) {
      inputFirstName.style.backgroundColor = "green";
      document.getElementById("firstNameErrorMsg").textContent = "";
      return true;
    } else {
      inputFirstName.style.backgroundColor = "red";
      document.getElementById("firstNameErrorMsg").textContent =
        "Champ Prénom de formulaire invalide, ex: Tom";
      return false;
    }
  }

  // Fonctions de Vérification du champ Nom:
  function checkedLastName() {
    const valueLastname = contact.lastName;
    let inputLastName = document.getElementById("lastName");

    if (firstAndLastNameRegEx(valueLastname)) {
      inputLastName.style.backgroundColor = "green";
      document.getElementById("lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = "red";
      document.getElementById("lastNameErrorMsg").textContent =
        "Champ Nom de formulaire invalide, ex: Portgas";
      return false;
    }
  }

  // Fonctions de Vérification du champ Adresse:
  function checkedAddress() {
    const ValueAdresse = contact.address;
    let inputAddress = document.getElementById("address");
    if (adresseRegEx(ValueAdresse)) {
      inputAddress.style.backgroundColor = "green";
      document.getElementById("addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = "red";

      document.getElementById("addressErrorMsg").textContent =
        "Champ Adresse de formulaire invalide, ex: 22 rue violet 84000";
      return false;
    }
  }

  // Fonctions de Vérification du champ Ville:
  function checkedCity() {
    const valueVille = contact.city;
    let inputCity = document.getElementById("city");
    if (cityRegEx(valueVille)) {
      inputCity.style.backgroundColor = "green";
      document.getElementById("cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = "red";
      document.getElementById("cityErrorMsg").textContent =
        "Champ Ville de formulaire invalide, ex: Marseille";
      return false;
    }
  }

  // Fonctions de Vérification du champ Email:
  function checkedMail() {
    const valueEmail = contact.email;
    let inputMail = document.getElementById("email");
    if (emailRegEx(valueEmail)) {
      inputMail.style.backgroundColor = "green";
      document.getElementById("emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.backgroundColor = "red";

      document.getElementById("emailErrorMsg").textContent =
        "Champ Email de formulaire invalide, ex: Portgas@mail.fr";
      return false;
    }
  }
  // Contrôle validité formulaire avant de l'envoyer dans le local storage
  if (
    checkedFirstName() &&
    checkedLastName() &&
    checkedAddress() &&
    checkedCity() &&
    checkedMail()
  ) {
    // Enregistrer le formulaire dans le local storage
    localStorage.setItem("contact", JSON.stringify(contact));
    sendToServer();
  } else {
    alert("Veuillez bien remplir le formulaire");
  }

  function sendToServer() {
    // Stock les Id de chaque produit dans le panier
    let products = [];
    // récupère l'orderId lors de la requête POST
    let orderId = "";

    const sendToServer = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      // Récupération et stockage de la réponse de l'API (orderId)
      .then((api) => {
        return api.json();
      })
      .then((data) => {
        source = data;
        orderId = source.orderId;
        console.log(orderId);
        document.location.href = "confirmation.html?id=" + orderId;
      });
  }
});
