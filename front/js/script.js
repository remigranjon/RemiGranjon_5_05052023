const apiUrl = "http://localhost:3000/api/products";
const items = document.getElementById("items");

// function that adds DOM elements given an array of products
function printProducts (array) {
    
    array.forEach(element => {
        printProduct(element);
    });
}

// function that adds DOM elements for specific product
function printProduct (product) {
    const htmlToAdd = `<a href="./product.html?id=${product._id}">\n\
    <article>\n\
        <img src="${product.imageUrl}" alt="${product.altTxt}">\n\
        <h3 class="productName">${product.name}</h3>\n\
        <p class="productDescription">${product.description}</p>\n\
    </article>\n\
</a>`
    items.innerHTML += htmlToAdd;
} 

fetch(apiUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(printProducts)
    .catch(function(err) {
        console.log(err);
    });