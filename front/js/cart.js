const apiUrl = "http://localhost:3000/api/products";

// function that adds DOM elements relative to a purchase order given the product and the purchase objects
function addPurchaseToDom(product,purchase) {
    const cart_items = document.getElementById("cart__items");
    const htmlToAdd = `<article class="cart__item" data-id="${purchase.id}" data-color="${purchase.color}">\n
        <div class="cart__item__img">\n
            <img src="${product.imageUrl}" alt="${product.altTxt}">\n
        </div>\n
        <div class="cart__item__content">\n
            <div class="cart__item__content__description">\n
                <h2>${product.name}</h2>\n
                <p>${purchase.color}</p>\n
                <p>${product.price} €</p>\n
            </div>\n
            <div class="cart__item__content__settings">\n
                <div class="cart__item__content__settings__quantity">\n
                    <p>Qté : </p>\n
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${purchase.quantity}">\n
                </div>\n
                <div class="cart__item__content__settings__delete">\n
                    <p class="deleteItem">Supprimer</p>\n
                </div>\n
            </div>\n
        </div>\n
    </article>`;
    cart_items.innerHTML+=htmlToAdd; 
}

// function that gives the product object given the purchase object and the array of products objects
function findProduct(purchase,products) {
    var productFound = "";
    products.forEach(product => {
        if (product._id === purchase.id) {
            productFound = product;
        }
    });
    return productFound;
}

// function that adds DOM elements of all purchases given the array of products objects
function printPurchases(products) {
    const cart_items = document.getElementById("cart__items");
    cart_items.innerHTML="";
    
    for (let i=0 ; i<localStorage.length ; i++) {
        var purchase = JSON.parse(localStorage.getItem(i));
        addPurchaseToDom(findProduct(purchase,products),purchase);

    }

    setTotal();
}

// function that returns an array of all purchases objects in localStorage
function getAllPurchases() {
    var purchases = [];
    for (let i=0; i<localStorage.length; i++) {
        purchases.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
    }
    return purchases;
}

// function that duplicates an array
function duplicate(array) {
    var response = [];
    for (const element of array) {
        response.push(element);
    }
    return response;
}


// function that checks if two purchases are identical and if true merge those objects ; return true or false
function checkAndMergeIdentical(purchases) {
    for (const purchase of purchases) {
        var arrayToCheck = duplicate(purchases);
        arrayToCheck.splice(arrayToCheck.findIndex(function (element) {
            if (element===purchase) return true
        }),1);
        for (const purchaseToCompare of arrayToCheck) {
            if (purchaseToCompare.id === purchase.id && purchaseToCompare.color === purchase.color) {
                purchase.quantity+=purchaseToCompare.quantity;
                purchases.splice(purchases.findIndex(function (element) {
                    if (element===purchaseToCompare) return true
                }),1);
                return true;
            }
        }
    }
    return false;
}

// Function that iterates checkAndMergeIdentical until it returns false
function completeCheckAndMergeIdentical(purchases) {
    while (checkAndMergeIdentical(purchases)) ;
    return purchases;
}

// Function that saves an array on the localStorage given the array of objects
function save(array) {
    var i=0;
    array.forEach(element => {
        localStorage.setItem(i,JSON.stringify(element));
        i++;
    });
}

// Function that sorts purchases array function of the id and color of products
function sortPurchases(purchases) {
    purchases.sort((a,b) => {
        var comparison = a.id.localeCompare(b.id)
        if (comparison===0) {
            comparison = a.color.localeCompare(b.color);
        }
        return comparison
    });
}

// Function that calls completeCheckAndMergeIdentical on localStorage content, sort and updates localStorage content 
function updateLocalStorage () {
    var purchases = completeCheckAndMergeIdentical(getAllPurchases());
    sortPurchases(purchases);
    localStorage.clear();
    save(purchases);
}

// Function that deletes purchase from localStorage given the id and color of the purchase
function deletePurchase(id,color) {
    var purchases = getAllPurchases();
    purchases = purchases.filter(element => {
        if (element.id !== id || element.color !== color) return true;
    });
    localStorage.clear();
    save(purchases);
}

// Function that sets deletePurchase function to all deleteItem buttons and remove corresponding element from the DOM
function setDeleteOnClick() {
    const deleteButtonsElements = document.getElementsByClassName("deleteItem");
    var deleteButtons = [].slice.call(deleteButtonsElements);
    deleteButtons.forEach(element => {
        element.onclick = function () {
            deletePurchase(element.closest(".cart__item").dataset.id,element.closest(".cart__item").dataset.color);
            element.closest(".cart__item").remove();
            setTotal();
        };
    });
}

// Function that calculates the total quantity of products
function calcQuantity() {
    const purchases = getAllPurchases();
    var quantity = 0;
    purchases.forEach(element => {
        quantity += element.quantity;
    });
    return quantity;
}

// Function that calculates the total price
function calcPrice() {
    const purchases = getAllPurchases();
    var price = 0;
    purchases.forEach(element => {
        price += element.quantity * element.price;
    });
    return price;
}

// Function that sets total quantity and total price on DOM
function setTotal() {
    const quantity = calcQuantity();
    const price = calcPrice();
    const totalQuantity = document.getElementById("totalQuantity");
    const totalPrice = document.getElementById("totalPrice");
    totalQuantity.innerHTML = quantity;
    totalPrice.innerHTML = price;
}

// Function that finds specific purchase given the id and color of the product
function findPurchase(id,color,purchases) {
    return purchases.filter(element => {
        if (element.id === id && element.color === color) return true
    })[0];
}


// Function that updates quantity of purchase on localStorage and updates DOM
function updateQuantity(element) {
    const id = element.closest(".cart__item").dataset.id;
    const color = element.closest(".cart__item").dataset.color;
    var purchases = getAllPurchases();
    var purchasesUpdated = purchases.map((purchase)=>{
        if (purchase.id === id && purchase.color === color) {
            purchase.quantity = parseInt(element.value);
        };
        return purchase
    });
    localStorage.clear();
    save(purchasesUpdated);
    setTotal();
}

//function that sets updateQuantity as onchange function of itemQuantity elements
function setUpdateQuantityOnChange() {
    const itemsQuantityElements = document.getElementsByClassName("itemQuantity");
    var itemsQuantity = [].slice.call(itemsQuantityElements);
    itemsQuantity.forEach(element => {
        element.onchange = () => {
            updateQuantity(element);
        };
    });
}

// function that checks if input "Prénom" is valid and display an error message otherwise
function checkFirstNameInput() {
    const firstName = document.getElementById("firstName").value;
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    const regex = /[^A-Za-zéèçàù -]/;
    
    if (firstName.search(regex)!==-1) {
        firstNameErrorMsg.innerHTML = "Cela n'est pas valide, votre prénom ne doit contenir ni chiffre ni caractère spécial";
        return false;
    }
    else {
        firstNameErrorMsg.innerHTML="";
        return true;
    }
}

// function that checks if input lastName is valid and display an error message otherwise
function checkLastNameInput() {
    const lastName = document.getElementById("lastName").value;
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    const regex = /[^A-Za-zéèçàù -]/;
    
    if (lastName.search(regex)!==-1) {
        lastNameErrorMsg.innerHTML = "Cela n'est pas valide, votre nom ne doit contenir ni chiffre ni caractère spécial";
        return false;
    }
    else {
        lastNameErrorMsg.innerHTML="";
        return true;
    }
}
// function that checks if input adress is valid and display an error message otherwise
function checkAddressInput() {
    const address = document.getElementById("address").value;
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    const regex = /[^A-Za-z0-9éèçàù -]/;
    
    if (address.search(regex)!==-1) {
        addressErrorMsg.innerHTML = "Cela n'est pas valide, votre adresse ne doit pas contenir de caractère spécial";
        return false;
    }
    else {
        addressErrorMsg.innerHTML="";
        return true;
    }
}

// function that checks if input city is valid and display an error message otherwise
function checkCityInput() {
    const city = document.getElementById("city").value;
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    const regex = /[^A-Za-zéèçàù -]/;
    
    if (city.search(regex)!==-1) {
        cityErrorMsg.innerHTML = "Cela n'est pas valide, votre ville ne doit contenir ni chiffre ni caractère spécial";
        return false;
    }
    else {
        cityErrorMsg.innerHTML="";
        return true;
    }
}

// Function that checks if input email is valid and display an error message otherwise
function checkEmailInput() {
    const email = document.getElementById("email").value;
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    // const regex = /[@.]/;
    
    if (email.indexOf("@")===-1 || email.indexOf(".")===-1) {
        emailErrorMsg.innerHTML = "Votre email n'est pas valide, il manque un @ ou un .";
        return false;
    } 
    else {
        emailErrorMsg.innerHTML="";
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

    if (checkFirstNameInput() && checkLastNameInput() && checkAddressInput() && checkCityInput() && checkEmailInput()) {
        var contact = {
            firstName : firstName.value,
            lastName : lastName.value,
            address : address.value,
            city : city.value,
            email : email.value
        }
        const purchases = getAllPurchases();
        var products = [];
        purchases.forEach(purchase => {
            products.push(purchase.id);
        });
        var response = {
            contact : contact,
            products : products
        }
        return JSON.stringify(response);
    }
    else return false;
}

// function that's going to be set to onsubmit form function
function formOnSubmit () {
    if (createAPIObject()) {
        
        fetch(apiUrl+"/order",{
            method: "POST",
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
                },
            body: createAPIObject()
        })
            .then(function(res) {
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
            })
    }
}

// function that sets onsubmit function to form
function setOnSubmit () {
    form = document.getElementsByClassName("cart__order__form")[0];
    form.onsubmit = event => {
        event.preventDefault();
        formOnSubmit();
    };
}

fetch(apiUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (products) {
        updateLocalStorage();
        return products;
    })
    .then(printPurchases)
    .then(setDeleteOnClick)
    .then(setUpdateQuantityOnChange)
    .then(setCheckerFunctions)
    .then(setOnSubmit)
    .catch(function(err) {
        console.log(err);
    });