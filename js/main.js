'use strict';

const inputsearch = document.querySelector('.js-inputsearch');
const searchbtn = document.querySelector('.js-searchbtn');
const productsList = document.querySelector('.js-productslist');
const cartList = document.querySelector('.js-cartlist');
const clearCartBtn = document.querySelector('.js-clearcart');
const url = 'https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json';

let productsArray = [];
const cart = [];

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (savedCart) {
    cart.push(...savedCart);
    paintCart();
  }
}

// Pintar productos en el DOM
function paintProducts(products) {
  productsList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    const imageUrl = product.image || 'https://placehold.co/200x200?text=No+Image';
    const isInCart = cart.find(item => item.id === product.id);
    const buttonText = isInCart ? 'Eliminar del carrito' : 'Añadir al carrito';
    const buttonClass = isInCart ? 'js-addtocart-btn deletebtn' : 'js-addtocart-btn';

    li.classList.add('product-li');
    li.innerHTML = `
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      <img class='product-img' src='${imageUrl}' alt='${product.title}'>
      <button class='${buttonClass}' data-product-id='${product.id}'>${buttonText}</button>
    `;
    productsList.appendChild(li);
  });
}

// Pintar carrito en el DOM
function paintCart() {
  cartList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('product-li');
    li.innerHTML = `
      <button class='js-delete-btn' data-product-id='${item.id}'>✖</button>
      <h3>${item.title}</h3>
      <p>Price: $${item.price}</p>
      <img class='product-img' src='${item.image || 'https://placehold.co/200x200?text=No+Image'}' alt='${item.title}'>
    `;
    cartList.appendChild(li);
  });
}

// Cargar productos desde la API
fetch(url)
  .then(response => response.json())
  .then(data => {
    productsArray = data;
    paintProducts(productsArray);
  })
  .catch(error => console.error('Error', error));

// Botón de búsqueda
searchbtn.addEventListener('click', () => {
  const searchTerm = inputsearch.value.toLowerCase();
  const filteredProducts = productsArray.filter(product => product.title.toLowerCase().includes(searchTerm));
  paintProducts(filteredProducts);
});

// Click en productos (añadir/quitar carrito)
productsList.addEventListener('click', (event) => {
  if (!event.target.classList.contains('js-addtocart-btn')) return;

  const productId = event.target.dataset.productId;
  const product = productsArray.find(p => p.id == productId);

  const indexInCart = cart.findIndex(item => item.id == productId);

  if (indexInCart === -1) {
    // Añadir al carrito
    cart.push(product);
  } else {
    // Quitar del carrito
    cart.splice(indexInCart, 1);
  }

  paintCart();
  saveCart();
  paintProducts(productsArray);
});

// Click en carrito (eliminar producto)
cartList.addEventListener('click', (event) => {
  if (!event.target.classList.contains('js-delete-btn')) return;

  const productId = event.target.dataset.productId;
  const index = cart.findIndex(item => item.id == productId);

  if (index > -1) {
    cart.splice(index, 1);
  }

  paintCart();
  saveCart();
  paintProducts(productsArray);
});

// Botón limpiar carrito
clearCartBtn.addEventListener('click', () => {
  cart.length = 0;
  localStorage.removeItem('cart');
  paintCart();
  paintProducts(productsArray);
});

// Cargar carrito guardado 
loadCart();

