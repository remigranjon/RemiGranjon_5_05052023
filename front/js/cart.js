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
  //   for (let i = 0; i < localStorage.length; i++) {
  //     var purchase = JSON.parse(localStorage.getItem(i));
  //     addPurchaseToDom(findProduct(purchase, products), purchase);
  //   }

  setTotal(products);
}

// // function that returns an array of all purchases objects in localStorage
// function getAllPurchases() {
//   var purchases = [];
//   for (let i = 0; i < localStorage.length; i++) {
//     purchases.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
//   }
//   return purchases;
// }

// // function that duplicates an array
// function duplicate(array) {
//   var response = [];
//   for (const element of array) {
//     response.push(element);
//   }
//   return response;
// }

// // function that checks if two purchases are identical and if true merge those objects ; return true or false

// function checkAndMergeIdentical(purchases) {
//   // iteration over each "purchase" in the "purchases" array
//   for (const purchase of purchases) {
//     // creation of a copy of the "purchases" array
//     var arrayToCheck = duplicate(purchases);
//     // deletion of 1 element of "arrayToCheck" that equals "purchase"
//     arrayToCheck.splice(
//       arrayToCheck.findIndex(function (element) {
//         if (element === purchase) return true;
//       }),
//       1
//     );
//     // iteration over each remaining purchase of arrayToCheck
//     for (const purchaseToCompare of arrayToCheck) {
//       // if an element of "arrayToCheck" corresponds to the same product and with the same color
//       if (
//         purchaseToCompare.id === purchase.id &&
//         purchaseToCompare.color === purchase.color
//       ) {
//         // Adding quantity of this purchase to the original purchase
//         purchase.quantity += purchaseToCompare.quantity;
//         // Deleting this purchase
//         purchases.splice(
//           purchases.findIndex(function (element) {
//             if (element === purchaseToCompare) return true;
//           }),
//           1
//         );
//         return true;
//       }
//     }
//   }
//   return false;
// }

// // Function that iterates checkAndMergeIdentical until it returns false
// function completeCheckAndMergeIdentical(purchases) {
//   while (checkAndMergeIdentical(purchases));
//   return purchases;
// }

// // Function that saves an array on the localStorage given the array of objects
// function save(array) {
//   var i = 0;
//   array.forEach((element) => {
//     localStorage.setItem(i, JSON.stringify(element));
//     i++;
//   });
// }

// // Function that sorts purchases array function of the id and color of products
// function sortPurchases(purchases) {
//   purchases.sort((a, b) => {
//     var comparison = a.id.localeCompare(b.id);
//     if (comparison === 0) {
//       comparison = a.color.localeCompare(b.color);
//     }
//     return comparison;
//   });
// }

// // Function that calls completeCheckAndMergeIdentical on localStorage content, sort and updates localStorage content
// function updateLocalStorage() {
//   var purchases = completeCheckAndMergeIdentical(getAllPurchases());
//   sortPurchases(purchases);
//   localStorage.clear();
//   save(purchases);
// }

// Function that deletes purchase from localStorage given the id and color of the purchase
function deletePurchase(id, color) {
  var cart = getCart();
  cart = cart.filter((element) => {
    if (element.id !== id || element.color !== color) return true;
  });
  localStorage.clear();
  window.localStorage.setItem("cart", JSON.stringify(cart));
}

// // Function that deletes purchase from localStorage given the id and color of the purchase
// function deletePurchase(id, color) {
//     var purchases = getAllPurchases();
//     purchases = purchases.filter((element) => {
//       if (element.id !== id || element.color !== color) return true;
//     });
//     localStorage.clear();
//     save(purchases);
//   }

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
// // Function that calculates the total quantity of products
// function calcQuantity() {
//   const purchases = getAllPurchases();
//   var quantity = 0;
//   purchases.forEach((element) => {
//     quantity += element.quantity;
//   });
//   return quantity;
// }

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
// // Function that calculates the total price
// function calcPrice(products) {
//   const purchases = getAllPurchases();
//   var price = 0;
//   purchases.forEach((purchase) => {
//     const product = findProduct(purchase, products);
//     price += purchase.quantity * product.price;
//   });
//   return price;
// }

// Function that sets total quantity and total price on DOM
function setTotal(products) {
  const quantity = calcQuantity();
  const price = calcPrice(products);
  const totalQuantity = document.getElementById("totalQuantity");
  const totalPrice = document.getElementById("totalPrice");
  totalQuantity.innerHTML = quantity;
  totalPrice.innerHTML = price;
}

// Function that finds specific purchase given the id and color of the product
// function findPurchase(id,color,purchases) {
//     return purchases.filter(element => {
//         if (element.id === id && element.color === color) return true
//     })[0];
// }

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
// // Function that updates quantity of purchase on localStorage and updates DOM
// function updateQuantity(element, products) {
//   const id = element.closest(".cart__item").dataset.id;
//   const color = element.closest(".cart__item").dataset.color;
//   var purchases = getAllPurchases();
//   var purchasesUpdated = purchases.map((purchase) => {
//     if (purchase.id === id && purchase.color === color) {
//       purchase.quantity = parseInt(element.value);
//     }
//     return purchase;
//   });
//   localStorage.clear();
//   save(purchasesUpdated);
//   setTotal(products);
// }

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
  const regex = /[^A-Za-zéèçàù -]/;

  if (city.search(regex) !== -1) {
    cityErrorMsg.innerHTML =
      "Cela n'est pas valide, votre ville ne doit contenir ni chiffre ni caractère spécial autre que '-'";
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
  // const regex = /[@.]/;

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
    var contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    const purchases = getAllPurchases();
    var products = [];
    purchases.forEach((purchase) => {
      products.push(purchase.id);
    });
    var response = {
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
        // localStorage.setItem("orderId",res.orderId);
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
  //   .then(function (products) {
  //     updateLocalStorage();
  //     return products;
  //   })
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
