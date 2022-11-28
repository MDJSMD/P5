//Dans cette fonction les produits se trouvant dans le localstorage sont récupérés 
function getCart() {
    return JSON.parse(localStorage.getItem("product"))
}
//Dans cette fonction produits se trouvant dans le panier sont affichés.
function cartCheck() {
    const n = getCart();
    return n === null || n.length === 0 ? (document.querySelector("#cart__items").innerHTML = `
            <article class="cart__item">
                <h2>Aucun produit</h2>   
                <p>Veuillez retourner sur la page d'accueil <br>
                    afin de sélectionner un produit.</p>
            </article>`, document.querySelector(".cart__order__form").hidden = !0, document.querySelector("#totalQuantity").innerHTML = 0, document.querySelector("#totalPrice").innerHTML = 0, !1) : !0
}
// Dans cette fonction le fichier DOM est modifié pour afficher les produits se trouvant dans le panier.
async function cartDisplay() {
    const r = getCart();
    let n = 0,
        t = 0,
        i = "";
    for (product of r) await fetch(`http://localhost:3000/api/products/${product.id}`).then(n => n.json()).then(r => {
        n += parseInt(r.price) * parseInt(product.quantity), t += parseInt(product.quantity), i += `
                <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                    <div class="cart__item__img">
                        <img src="${r.imageUrl}" alt="${r.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${r.name}</h2>
                            <p>${product.color}</p>
                            <p>${r.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity"
                                    min="1" max="100" value="${product.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`
    }).catch(n => {
        console.log("Erreur: " + n)
    });
    document.querySelector("#cart__items").innerHTML = i;
    document.querySelector("#totalQuantity").innerHTML = t;
    document.querySelector("#totalPrice").innerHTML = n
}
// Dans cette fonction le panier est mis à jour automatiquement.
async function loadPage() {
    cartCheck() && (await cartDisplay(), productQuantity(), productRemoval())
}
// Dans cette fonction la quantité des produits se trouvant dans le panier est modifié.
function productQuantity() {
    const n = getCart(),
        t = document.querySelectorAll(".itemQuantity");
    t.forEach(t => {
        t.addEventListener("change", t => {
            if (t.target.value < 1 || t.target.value > 100) alert("Veuillez choisir entre 1 et 100 articles");
            else {
                const i = t.target.value,
                    r = t.target.closest("article").dataset.id,
                    u = t.target.closest("article").dataset.color,
                    f = n.findIndex(n => n.id === r && n.color === u);
                n[f].quantity = i;
                localStorage.setItem("product", JSON.stringify(n));
                loadPage()
            }
        })
    })
}
// Dans cette fonction les produits sont supprimés depuis le panier.
function productRemoval() {
    const n = getCart(),
        t = document.querySelectorAll(".deleteItem");
    t.forEach(t => {
        t.addEventListener("click", t => {
            const i = t.target.closest("article").dataset.id,
                r = t.target.closest("article").dataset.color,
                u = n.filter(n => !(n.id == i && n.color === r));
            localStorage.setItem("product", JSON.stringify(u));
            loadPage()
        })
    })
}
//Dans cette fonction je contrôle la validité des données de l'utilisateur.
function formValidation() {
    const n = () => {
            const t = document.querySelector("#firstName"),
                n = document.querySelector("#firstNameErrorMsg");
            if (/^([A-Za-zÀ-ú]{2,20})?([-])?([A-Za-zÀ-ú]{2,20})$/.test(t.value)) return n.innerText = "", !0;
            n.innerText = "Veuillez renseigner un prénom."
        },
        t = () => {
            const t = document.querySelector("#lastName"),
                n = document.querySelector("#lastNameErrorMsg");
            if (/^([A-Za-zÀ-ú]{2,20})?([-])?([A-Za-zÀ-ú]{2,20})$/.test(t.value)) return n.innerText = "", !0;
            n.innerText = "Veuillez renseigner un nom."
        },
        i = () => {
            const t = document.querySelector("#address"),
                n = document.querySelector("#addressErrorMsg");
            if (/^([0-9]{1,4})?([,])?([A-Za-zÀ-ú' ]{2,40})$/.test(t.value)) return n.innerText = "", !0;
            n.innerText = "Veuillez renseigner une adresse."
        },
        r = () => {
            const t = document.querySelector("#city"),
                n = document.querySelector("#cityErrorMsg");
            if (/^([A-Za-zÀ-ú']{2,20})?([-])?([A-Za-zÀ-ú']{2,20})?([-])?([A-Za-zÀ-ú']{2,20})$/.test(t.value)) return n.innerText = "", !0;
            n.innerText = "Veuillez renseigner une ville."
        },
        u = () => {
            const t = document.querySelector("#email"),
                n = document.querySelector("#emailErrorMsg");
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.value)) return n.innerText = "", !0;
            n.innerText = "Veuillez renseigner un email."
            // Rajouter conditions pour @
        };
    return n() && t() && i() && r() && u() ? !0 : !1
}
loadPage(), async function() { //Dans cette fonction les elements sont envoyés vers la page confirmation.
    const n = getCart(),
        t = document.querySelector("#order");
    t.addEventListener("click", async t => {
        if (t.preventDefault(), formValidation()) {
            let i = {
                    firstName: document.querySelector("#firstName").value,
                    lastName: document.querySelector("#lastName").value,
                    address: document.querySelector("#address").value,
                    city: document.querySelector("#city").value,
                    email: document.querySelector("#email").value
                },
                t = [];
            n.forEach(n => {
                t.push(n.id)
            });
            let r = {
                contact: i,
                products: t
            };
            await fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(r)
            }).then(n => n.json()).then(n => {
                localStorage.clear(), location.href = `./confirmation.html?id=${n.orderId}`
            }).catch(n => {
                console.log("Erreur: " + n)
            })
        } else alert("Veuillez verifier vos informations.")
    })
}();