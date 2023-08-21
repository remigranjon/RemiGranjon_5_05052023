const apiUrl = "http://localhost:3000/api/products";
const url = document.URL;
const searchParams = new URLSearchParams(document.location.search);
const id = searchParams.get("id");

// function that adds img element to the DOM given the product object
function addImg(product) {
  const item_img = document.getElementsByClassName("item__img")[0];

  const imgToAdd = document.createElement("img");
  imgToAdd.src = product.imageUrl;
  imgToAdd.alt = product.altTxt;
  item_img.appendChild(imgToAdd);
}

//function that adds name element to the DOM given the product object
function addName(product) {
  const title = document.getElementById("title");
  title.innerHTML += product.name;
}

//function that adds price element to the DOM given the product object
function addPrice(product) {
  const price = document.getElementById("price");
  price.innerHTML += product.price;
}

//function that adds description element to the DOM given the product object
function addDescription(product) {
  const description = document.getElementById("description");
  description.innerHTML += product.description;
}

//function that adds color options to the DOM given the product object
function addColors(product) {
  const colors = document.getElementById("colors");
  product.colors.forEach((color) => {
    const optionColor = document.createElement("option");
    optionColor.value = color;
    optionColor.innerHTML = color;

    colors.appendChild(optionColor);
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

// function that check end merge identical element (same id and same color) in the cart
function checkAndMergeIdentical(cart) {
  return cart.reduce((newCart, purchase) => {
    indexOfSamePurchase = newCart.findIndex(
      (element) =>
        element.id === purchase.id && element.color === purchase.color
    );
    if (indexOfSamePurchase > -1) {
      purchase.quantity += newCart[indexOfSamePurchase].quantity;
      newCart = newCart.filter((element) => {
        return !(
          element.id === purchase.id && element.color === purchase.color
        );
      });
      //   delete newCart[indexOfSamePurchase];
    }
    newCart.push(purchase);
    return newCart;
  }, []);
}

// Function that sorts cart array function of the id and color of products
function sortCart(cart) {
  cart.sort((a, b) => {
    var comparison = a.id.localeCompare(b.id);
    if (comparison === 0) {
      comparison = a.color.localeCompare(b.color);
    }
    return comparison;
  });
}

// function that adds an object (purchase) containing the product id, the color and the quantity chosen to the local storage
function savePurchase() {
  const colors = document.getElementById("colors");
  const quantity = document.getElementById("quantity");

  if (colors.value != "" && quantity.value != 0) {
    const purchase = {
      id: id,
      color: colors.value,
      quantity: parseInt(quantity.value),
    };
    let cart = window.localStorage.getItem("cart")
      ? JSON.parse(window.localStorage.getItem("cart"))
      : [];

    cart.push(purchase);

    cart = checkAndMergeIdentical(cart);

    sortCart(cart);

    window.localStorage.setItem("cart", JSON.stringify(cart));
    //   window.localStorage.setItem(
    //     `purchase${window.localStorage.length}`,
    //     JSON.stringify(purchase)
    //   );
  }
}

//function that sets savePurchase as onclick function of addToCart button
function setOnClick() {
  const addToCart = document.getElementById("addToCart");
  addToCart.onclick = function () {
    savePurchase();
  };
}

fetch(apiUrl + "/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    addDom(product);
    setOnClick(product);
  })
  .catch(function (err) {
    console.log(err);
  });
