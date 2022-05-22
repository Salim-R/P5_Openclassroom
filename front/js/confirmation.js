const getproductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const orderId = getproductId();
console.log(orderId);
const productInStorage = JSON.parse(localStorage.getItem("produit"));
//Affichage de l'orderId dans le DOM
(function () {
  document.getElementById("orderId").innerHTML = `
	<br>
	<strong>${orderId}</strong>. <br>
	<br>
	`;
  localStorage.clear();
})();
