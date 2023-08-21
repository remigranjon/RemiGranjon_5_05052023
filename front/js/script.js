const apiUrl = "http://localhost:3000/api/products";
const items = document.getElementById("items");

// function that adds DOM elements given an array of products
function printProducts(array) {
  array.forEach((element) => {
    printProduct(element);
  });
}

// function that adds DOM elements for specific product
function printProduct(product) {
  const productLink = document.createElement("a");
  productLink.href = `./product.html?id=${product._id}`;
  items.appendChild(productLink);

  const productArticle = document.createElement("article");
  productLink.appendChild(productArticle);

  const productImage = document.createElement("img");
  productImage.src = product.imageUrl;
  productImage.alt = product.altTxt;
  productArticle.appendChild(productImage);

  const productName = document.createElement("h3");
  productName.classList.add("productName");
  productName.innerHTML = product.name;
  productArticle.appendChild(productName);

  const productDescription = document.createElement("p");
  productDescription.classList.add("productDescription");
  productDescription.innerHTML = product.description;
  productArticle.appendChild(productDescription);
}

fetch(apiUrl)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(printProducts)
  .catch(function (err) {
    console.log(err);
  });
