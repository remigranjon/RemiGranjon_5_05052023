const apiUrl = "http://localhost:3000/api/products";

// function that adds DOM elements relative to a purchase order given the product and the purchase objects
function addPurchaseToDom(product, purchase) {
  const cart_items = document.getElementById("cart__items");

  const cart_item = document.createElement("article");
  cart_item.classList.add("cart__item");
  cart_item.setAttribute("data-id", purchase.id);
  cart_item.setAttribute("data-color", purchase.color);
  cart_items.appendChild(cart_item);

  const cart_item_img = document.createElement("div");
  cart_item_img.classList.add("cart__item__img");
  cart_item.appendChild(cart_item_img);

  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.altTxt;
  cart_item_img.appendChild(image);

  const cart_item_content = document.createElement("div");
  cart_item_content.classList.add("cart__item__content");
  cart_item.appendChild(cart_item_content);

  const cart_item_content_description = document.createElement("div");
  cart_item_content_description.classList.add(
    "cart__item__content__description"
  );
  cart_item_content.appendChild(cart_item_content_description);

  const product_name = document.createElement("h2");
  product_name.innerHTML = product.name;
  cart_item_content_description.appendChild(product_name);

  const purchase_color = document.createElement("p");
  purchase_color.innerHTML = purchase.color;
  cart_item_content_description.appendChild(purchase_color);

  const product_price = document.createElement("p");
  product_price.innerHTML = `${product.price} €`;
  cart_item_content_description.appendChild(product_price);

  const cart_item_content_settings = document.createElement("div");
  cart_item_content_settings.classList.add("cart__item__content__settings");
  cart_item_content.appendChild(cart_item_content_settings);

  const cart_item_content_settings_quantity = document.createElement("div");
  cart_item_content_settings_quantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cart_item_content_settings.appendChild(cart_item_content_settings_quantity);

  const quantity_p = document.createElement("p");
  quantity_p.innerHTML = "Qté : ";
  cart_item_content_settings_quantity.appendChild(quantity_p);

  const quantity_input = document.createElement("input");
  quantity_input.type = "number";
  quantity_input.classList.add("itemQuantity");
  quantity_input.name = "itemQuantity";
  quantity_input.min = "1";
  quantity_input.max = "100";
  quantity_input.value = purchase.quantity;
  cart_item_content_settings_quantity.appendChild(quantity_input);

  const cart_item_content_settings_delete = document.createElement("div");
  cart_item_content_settings_delete.classList.add(
    "cart__item__content__settings__delete"
  );
  cart_item_content_settings.appendChild(cart_item_content_settings_delete);

  const deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");
  deleteItem.innerHTML = "Supprimer";
  cart_item_content_settings_delete.appendChild(deleteItem);
}

// function that finds the product object given the purchase object and the array of products objects
function findProduct(purchase, products) {
  let productFound = "";
  products.forEach((product) => {
    if (product._id === purchase.id) {
      productFound = product;
    }
  });
  return productFound;
}

// function that returns the cart contained in localStorage
function getCart() {
  const cart = window.localStorage.getItem("cart")
    ? JSON.parse(window.localStorage.getItem("cart"))
    : [];
  return cart;
}

// function that adds DOM elements of all purchases given the array of products objects
function printPurchases(products) {
  const cart_items = document.getElementById("cart__items");
  cart_items.innerHTML = "";

  const cart = getCart();

  cart.map((purchase) =>
    addPurchaseToDom(findProduct(purchase, products), purchase)
  );
  setTotal(products);
}

// Function that deletes purchase from localStorage given the id and color of the purchase
function deletePurchase(id, color) {
  var cart = getCart();
  cart = cart.filter((element) => {
    if (element.id !== id || element.color !== color) return true;
  });
  localStorage.clear();
  window.localStorage.setItem("cart", JSON.stringify(cart));
}

// Function that sets deletePurchase function to all deleteItem buttons and remove corresponding element from the DOM
function setDeleteOnClick(products) {
  const deleteButtonsElements = document.getElementsByClassName("deleteItem");
  // conversion into an array
  var deleteButtons = [].slice.call(deleteButtonsElements);
  deleteButtons.forEach((element) => {
    element.onclick = function () {
      deletePurchase(
        element.closest(".cart__item").dataset.id,
        element.closest(".cart__item").dataset.color
      );
      element.closest(".cart__item").remove();
      setTotal(products);
    };
  });
}

// Function that calculates the total quantity of products
function calcQuantity() {
  const cart = getCart();
  var quantity = 0;
  cart.forEach((element) => {
    quantity += element.quantity;
  });
  return quantity;
}

// Function that calculates the total price
function calcPrice(products) {
  const cart = getCart();
  var price = 0;
  cart.forEach((purchase) => {
    const product = findProduct(purchase, products);
    price += purchase.quantity * product.price;
  });
  return price;
}

// Function that sets total quantity and total price on DOM
function setTotal(products) {
  const quantity = calcQuantity();
  const price = calcPrice(products);
  const totalQuantity = document.getElementById("totalQuantity");
  const totalPrice = document.getElementById("totalPrice");
  totalQuantity.innerHTML = quantity;
  totalPrice.innerHTML = price;
}

// Function that updates quantity of purchase on localStorage and updates DOM
function updateQuantity(element, products) {
  const id = element.closest(".cart__item").dataset.id;
  const color = element.closest(".cart__item").dataset.color;
  const cart = getCart();
  const cartUpdated = cart.map((purchase) => {
    if (purchase.id === id && purchase.color === color) {
      purchase.quantity = parseInt(element.value);
    }
    return purchase;
  });
  localStorage.clear();
  window.localStorage.setItem("cart", JSON.stringify(cartUpdated));
  setTotal(products);
}

//function that sets updateQuantity as onchange function of itemQuantity elements
function setUpdateQuantityOnChange(products) {
  const itemsQuantityElements = document.getElementsByClassName("itemQuantity");
  // conversion into an array
  var itemsQuantity = [].slice.call(itemsQuantityElements);
  itemsQuantity.forEach((element) => {
    element.onchange = () => {
      updateQuantity(element, products);
    };
  });
}

// function that checks if input "Prénom" is valid and display an error message otherwise
function checkFirstNameInput() {
  const firstName = document.getElementById("firstName").value;
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const regex = /[^A-Za-zéèçàù -]/;

  if (firstName.search(regex) !== -1) {
    firstNameErrorMsg.innerHTML =
      "Cela n'est pas valide, votre prénom ne doit contenir ni chiffre ni caractère spécial autre que '-'";
    return false;
  } else {
    firstNameErrorMsg.innerHTML = "";
    return true;
  }
}

// function that checks if input lastName is valid and display an error message otherwise
function checkLastNameInput() {
  const lastName = document.getElementById("lastName").value;
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const regex = /[^A-Za-zéèçàù -]/;

  if (lastName.search(regex) !== -1) {
    lastNameErrorMsg.innerHTML =
      "Cela n'est pas valide, votre nom ne doit contenir ni chiffre ni caractère spécial autre que '-'";
    return false;
  } else {
    lastNameErrorMsg.innerHTML = "";
    return true;
  }
}
// function that checks if input adress is valid and display an error message otherwise
function checkAddressInput() {
  const address = document.getElementById("address").value;
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  const regex = /[^A-Za-z0-9éèçàù -]/;

  if (address.search(regex) !== -1) {
    addressErrorMsg.innerHTML =
      "Cela n'est pas valide, votre adresse ne doit pas contenir de caractère spécial autre que '-'";
    return false;
  } else {
    addressErrorMsg.innerHTML = "";
    return true;
  }
}

// function that checks if input city is valid and display an error message otherwise
function checkCityInput() {
  const city = document.getElementById("city").value;
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const regex = /[^A-Za-z0-9éèçàù -]/;

  if (city.search(regex) !== -1) {
    cityErrorMsg.innerHTML =
      "Cela n'est pas valide, votre ville ne doit pas contenir de caractère spécial autre que '-'";
    return false;
  } else {
    cityErrorMsg.innerHTML = "";
    return true;
  }
}

// Function that checks if input email is valid and display an error message otherwise
function checkEmailInput() {
  const email = document.getElementById("email").value;
  const emailErrorMsg = document.getElementById("emailErrorMsg");

  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    emailErrorMsg.innerHTML =
      "Votre email n'est pas valide, il manque un @ ou un .";
    return false;
  } else {
    emailErrorMsg.innerHTML = "";
    return true;
  }
}

// function that sets checker functions as onchange function on the DOM
function setCheckerFunctions() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");
  lastName.onchange = checkLastNameInput;
  firstName.onchange = checkFirstNameInput;
  address.onchange = checkAddressInput;
  city.onchange = checkCityInput;
  email.onchange = checkEmailInput;
}

// Function that creates the JSON object sent to the API
function createAPIObject() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");

  if (
    checkFirstNameInput() &&
    checkLastNameInput() &&
    checkAddressInput() &&
    checkCityInput() &&
    checkEmailInput()
  ) {
    const contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    const cart = getCart();
    let products = [];
    cart.forEach((purchase) => {
      products.push(purchase.id);
    });
    const response = {
      contact: contact,
      products: products,
    };
    return JSON.stringify(response);
  } else return false;
}

// function that's going to be set to onsubmit form function
function formOnSubmit() {
  if (createAPIObject()) {
    fetch(apiUrl + "/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: createAPIObject(),
    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (res) {
        localStorage.clear();
        location.assign(`./confirmation.html?orderId=${res.orderId}`);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

// function that sets onsubmit function to form
function setOnSubmit() {
  form = document.getElementsByClassName("cart__order__form")[0];
  form.onsubmit = (event) => {
    event.preventDefault();
    formOnSubmit();
  };
}

fetch(apiUrl)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) => {
    printPurchases(products);
    return products;
  })
  .then((products) => {
    setDeleteOnClick(products);
    return products;
  })
  .then((products) => {
    setUpdateQuantityOnChange(products);
  })
  .then(setCheckerFunctions)
  .then(setOnSubmit)
  .catch(function (err) {
    console.log(err);
  });
