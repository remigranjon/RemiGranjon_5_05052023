const apiUrl = "http://localhost:3000/api/products";
const url = document.URL;
const searchParams = new URLSearchParams(document.location.search);
const id = searchParams.get("id");


// function that adds img element to the DOM given the product object
function addImg(product) {
    const item_img = document.getElementsByClassName("item__img")[0];
    item_img.innerHTML+= `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}

//function that adds name element to the DOM given the product object
function addName(product) {
    const title=document.getElementById("title");
    title.innerHTML+=product.name;
}

//function that adds price element to the DOM given the product object
function addPrice(product) {
    const price = document.getElementById("price");
    price.innerHTML+=product.price;
}

//function that adds description element to the DOM given the product object
function addDescription(product) {
    const description = document.getElementById("description");
    description.innerHTML+=product.description;
}

//function that adds color options to the DOM given the product object
function addColors(product) {
    const colors = document.getElementById("colors");
    product.colors.forEach(color => {
        colors.innerHTML+=`<option value="${color}">${color}</option>`
    });
}


// function that adds DOM elements given the product object
function addDom(product) {
    addImg(product);
    addName(product);
    addPrice(product);
    addDescription(product);
    addColors(product);
    
}

// function that adds an object (purchase) containing the product id, the color and the quantity chosen to the local storage
function savePurchase () {
    const colors = document.getElementById("colors");
    const quantity = document.getElementById("quantity");
    const purchase = {
        id: id,
        color: colors.value,
        quantity: parseInt(quantity.value),
    }
    window.localStorage.setItem(`purchase${window.localStorage.length}`,JSON.stringify(purchase));
}

//function that sets savePurchase as onclick function of addToCart button 
function setOnClick () {
    const addToCart = document.getElementById("addToCart");
    addToCart.onclick = function () {
        savePurchase();
    }
}

fetch(apiUrl+"/"+id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(product) {
        addDom(product);
        setOnClick(product);
    })
    .catch(function(err){
        console.log(err);
    });
