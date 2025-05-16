'use strict';

const inputsearch = document.querySelector('.js-inputsearch');
const searchbtn = document.querySelector('.js-searchbtn');
const productsList = document.querySelector('.js-productslist');
const url = 'https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json';
const cartList = document.querySelector('.js-cartlist');

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
      <button class='js-addtocart-btn' data-product-id='${product.id}'>Añadir al carrito</button>
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

const cart=[];

/*Función pintar productos carrito en el DOM*/
function paintCart() {
  cartList.innerHTML = '';
  for(let i=0; i<cart.length; i++){
    const li = document.createElement('li');
    li.classList.add('product-li');
    li.innerHTML = `
      <h3>${cart[i].title}</h3>
      <p>Price: $${cart[i].price}</p>
      <img class='product-img' src='${cart[i].image}' alt='${cart[i].title}'>
      <button class='js-delete-btn' data-product-id='${cart[i].id}'>Eliminar del carrito</button>
    `;
    cartList.appendChild(li);
  }
}


productsList.addEventListener('click', (event) => {
  // Comprobar si el click fue en un botón "Añadir al carrito"
  if (event.target.classList.contains('js-addtocart-btn')) {
    const button = event.target;
    //Cambiar botón
    if (button.textContent === 'Añadir al carrito') {
      button.textContent = 'Eliminar del carrito';
      button.classList.add('deletebtn'); 
    } else {
      button.textContent = 'Añadir al carrito';
      button.classList.remove('deletebtn');
    }
    // Obtener datos del producto
    const productId = button.dataset.productId;
    const product = productsArray.find(p => p.id == productId);

    // Añadir y eliminar productos del carrito
    if (button.textContent === 'Eliminar del carrito') {
  cart.push(product);
} else {
  const index = cart.findIndex(p => p.id == productId);
  if (index > -1) {
    cart.splice(index, 1);
  }
}
    //Actualizar carrito
    paintCart()
  }
});



localStorage.setItem('')