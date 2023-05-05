const orderId = document.getElementById("orderId");
const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
orderId.innerHTML = urlParams.get("orderId");
