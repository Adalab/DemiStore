'use strict';

const inputsearch = document.querySelector('.js-inputsearch');
const searchbtn = document.querySelector('.js-searchbtn');
const productsList = document.querySelector('.js-productslist');
const url = 'https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json';
const cartList = document.querySelector('.js-cartlist');
const clearCartBtn = document.querySelector('.js-clearcart');

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

    const isInCart = cart.find(item => item.id === product.id);

    let buttonText = '';
    let buttonClass = 'js-addtocart-btn';

    if (isInCart) {
      buttonText = 'Eliminar del carrito';
      buttonClass += ' deletebtn'; // añade clase extra
    } else {
      buttonText = 'Añadir al carrito';
    }

    li.classList.add('product-li');
    li.innerHTML = `
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      <img class='product-img' src='${imageUrl}' alt='${product.title}'>
      <button class='${buttonClass}' data-product-id='${product.id}'>${buttonText}</button>
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

    paintProducts(filteredProducts); 
});

const cart=[];

//Recuperar carrito al cargar la página
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (savedCart) {
  cart.push(...savedCart); // Recupera los productos guardados
  paintCart();             // Muestra el carrito en pantalla
  }

/*Función pintar productos carrito en el DOM*/
function paintCart() {
  cartList.innerHTML = '';
  for(let i=0; i<cart.length; i++){
    const li = document.createElement('li');
    li.classList.add('product-li');
    li.innerHTML = `
      <button class='js-delete-btn' data-product-id='${cart[i].id}'>✖</button>
      <h3>${cart[i].title}</h3>
      <p>Price: $${cart[i].price}</p>
      <img class='product-img' src='${cart[i].image}' alt='${cart[i].title}'>
    `;
    cartList.appendChild(li);
  }
}


productsList.addEventListener('click', (event) => {
  if (event.target.classList.contains('js-addtocart-btn')) {
    const button = event.target;
    const productId = button.dataset.productId;
    const product = productsArray.find(p => p.id == productId);

    const isAdding = button.textContent === 'Añadir al carrito';

    if (isAdding) {
      button.textContent = 'Eliminar del carrito';
      button.classList.add('deletebtn');

      const alreadyInCart = cart.find(item => item.id == productId);
      if (!alreadyInCart) {
        cart.push(product);
      }
    } else {
      button.textContent = 'Añadir al carrito';
      button.classList.remove('deletebtn');

      const index = cart.findIndex(p => p.id == productId);
      if (index > -1) {
        cart.splice(index, 1);
      }
    }

    paintCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  }
});

cartList.addEventListener('click', (event) => {
  if (event.target.classList.contains('js-delete-btn')) {
    const productId = event.target.dataset.productId;

    const index = cart.findIndex(p => p.id == productId);
    if (index > -1) {
      cart.splice(index, 1);
    }

    paintCart();
    localStorage.setItem('cart', JSON.stringify(cart));

    paintProducts(productsArray);
  }
});

clearCartBtn.addEventListener('click', () => {
  localStorage.removeItem('cart');
  cart.length = 0;               
  paintCart();                    
  paintProducts(productsArray); 
})

  
