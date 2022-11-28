
//Dans cette fonction l'ID est affiché avec un message de confirmation.
(function OrderConfirmation() {
    const n = new URL(window.location.href),
        t = n.searchParams.get("id");
    document.querySelector("#orderId").innerHTML = `
        ${t}<br>
        Merci pour vos achats!`
})();