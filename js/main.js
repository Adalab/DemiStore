'use strict';

const inputsearch = document.querySelector('.js-inputsearch');
const searchbtn = document.querySelector('.js-searchbtn');
const productsList = document.querySelector('.js-productslist');
const url = 'https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json';

/*Declaración función pintar productos en el DOM con botón "Add to Cart"*/
function paintProducts (productsArray) {

    productsList.innerHTML='';

    productsArray.forEach((product) => {
    const li = document.createElement('li');
    let imageUrl = '';
    if (product.image) {
    imageUrl = product.image;
    } else {
    imageUrl = 'https://placehold.co/200x200?text=No+Image';
    }
    li.classList.add('product-li');
      li.innerHTML = `
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      <img class='product-img' src='${imageUrl}' alt='${product.title}'>
      <button class='js-addtocart-btn' data-product-id='${product.id}'>Add to Cart</button>
    `;
    productsList.appendChild(li);
  });
};



/*Array lista productos*/
let productsArray = []
                
fetch (url)
    .then(response => response.json())
    .then(data => {
    productsArray = data;
    paintProducts(productsArray);  //Activar función pintadora
    })
    .catch(error=>console.error('Error',error));






/*Activar botón búsqueda*/
searchbtn.addEventListener('click',()=>{
    const searchTerm = inputsearch.value.toLowerCase(); // Obtener texto y pasar a minúsculas xsi acaso

    const filteredProducts = productsArray.filter(product => 
    product.title.toLowerCase().includes(searchTerm)
    );

    paintProducts(filteredProducts); // Pintar solo los productos que coinciden
});