
//Dans cette fonction je créer une nouvelle URL à laquelle j'ajoute un ID
function productCheck() {
    const n = new URL(window.location.href);
    return n.searchParams.get("id")
   
}
//Dans cette fonction j'affiche les produits que j'ai récupéré depuis l'API grâce à l'ID.
async function productInfos() {
        const n = productCheck();
        try {
            const t = await fetch(`http://localhost:3000/api/products/${n}`);
            return await t.json()
        } catch (t) {
            console.log("Erreur: " + t)
        }
    }
    
    //Dans cette fonction j'affiche directement dans le DOM chaque produit.
    (async function() {
        const n = await productInfos();
        document.querySelector(".item__img").innerHTML = `<img src="${n.imageUrl}" alt="${n.altTxt}">`;
        document.querySelector("#title").innerHTML = n.name;
        document.querySelector("#price").innerHTML = n.price;
        document.querySelector("#description").innerHTML = n.description;
        n.colors.forEach(n => {
            document.querySelector("#colors").innerHTML += `<option value="${n}">${n}</option>`
        })
    })(),

    function() {      //Dans cette fonction les options choisis par l'utilisateur sont envoyés dans le local storage.

        const n = document.querySelector("#addToCart");
        n.addEventListener("click", () => {
            const f = productCheck(),
                r = document.querySelector("#colors").value,
                i = document.querySelector("#quantity").value;
            let t = {
                    id: f,
                    color: r,
                    quantity: i
                },
                n = JSON.parse(localStorage.getItem("product")),
                u = () => {
                    r === "" ? alert("Veuillez sélectionner une couleur") : i < 1 || i > 100 ? alert("Veuillez choisir entre 1 et 100 articles") : (n.push(t), localStorage.setItem("product", JSON.stringify(n)), alert("Votre sélection à été ajoutée au panier"))
                };
            n ? (n.forEach((i, r) => {
                t.id === i.id && t.color === i.color && (t.quantity = parseInt(t.quantity) + parseInt(i.quantity), n.splice(r, 1))
            }), u()) : (n = [], u())
        })
    }();