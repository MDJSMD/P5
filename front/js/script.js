  // Ici fetch récupère le détails deds produits depuis l'API
  async function getItems() {
    try {
        const n = await fetch("http://localhost:3000/api/products");
        return await n.json()
    } catch (n) {
        console.log("Erreur: " + n)
    }
}
//Dans cette fonction, je modifie le DOM pour ajouter les élements
function showProducts(n) {
    document.querySelector("#items").innerHTML += `
        <a href="./product.html?id=${n._id}">
            <article>
                <img src="${n.imageUrl}" alt="${n.altTxt}">
                <h3 class="productName">${n.name}</h3>
                <p class="productDescription">${n.description}</p>
            </article>
        </a>`
}(async function() {
    const n = await getItems();
    n.forEach(n => {
        showProducts(n)
    })
})();



