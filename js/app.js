const cartContainer = document.querySelector('.cart-container')
const productoLista = document.querySelector('.producto-lista')
const cartLista = document.querySelector('.cart-lista');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');

let cartItemID = 1;


openNavbar()

function openNavbar(){
  window.addEventListener('DOMContentLoaded', () => {
    loadJSON();
    cargarCarrito()
  });
  // Al hacer click en button menu se desplega
  document.querySelector('.navbar-toggler').addEventListener('click', () => {
    document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
  });

  //  show/hide cart container
  document.getElementById('cart-btn').addEventListener('click', () => {
    cartContainer.classList.toggle('show-cart-container');
  });
  //añadir al carrito
  productoLista.addEventListener('click', purchaseProduct);
  //borrar del carrito
  cartLista.addEventListener('click', borrarProducto);

} 

// subir carrito informacion
function subirCarrito(){
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productoContador;
  cartTotalValue.textContent = cartInfo.total;
}



//CARGANDO PRODUCTO ITEM CONTENIDO DE ARCHIVO JSON
function loadJSON(){
  fetch('data.json')
  .then(response => response.json())
  .then(data =>{
    let html = '';
    data.forEach(product => {
      html+= `
        <div class="producto-item">
          <div class="producto-img">
            <img src="${product.img}" alt="honey2">
            <button type="button" class="add-carrito-btn"><i class="fas fa-shopping-cart"></i>Añadir al carrito
            </button>
          </div>

          <div class="producto-contendio">
            <h3 class="producto-nombre">${product.nombre}</h3>
            <span class="producto-categoria">${product.tag}</span>
            <p class="prducto-precio">$${product.precio}</p>
          </div>
        </div>
      `;
    });
    productoLista.innerHTML = html;
  })
  .catch(error => {
    alert(`Feeeeeeeeer`);
  })
}

//purchaseProduct comprarproducto de la lista
function purchaseProduct(e){
  if(e.target.classList.contains('add-carrito-btn')){
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}

///////////////////////////////////
//despues de añadir al carrito boton click
function getProductInfo(product){
  let productInfo = {
    id: cartItemID,
    img: product.querySelector('.producto-img img').src,
    nombre: product.querySelector('.producto-nombre').textContent,
    tag: product.querySelector('.producto-categoria').textContent,
    precio: product.querySelector('.prducto-precio').textContent
  }
  cartItemID++ // incrementa 
  // console.log(productInfo);
  addToCartList(productInfo);
  guardarProductoStorage(productInfo);
}

// Añadir el producto seleccionado a la lista del carrito
function addToCartList(product){
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.setAttribute('data-id', `${product.id}`);
  cartItem.innerHTML = `
    <img src="${product.img}" alt="honey">
    <div class="cart-item-info">
      <h3 class="cart-item-nombre">${product.nombre}</h3>
      <span class="cart-item-categoria">${product.tag}</span>
      <span class="cart-item-precio">$${product.precio}</span>
    </div>

    <button type="button" class="cart-item-del-btn">
      <i class="fas fa-times"></i>
    </button>
  `;
  cartLista.appendChild(cartItem);
}

// Guardar producto en local Storage.
function guardarProductoStorage(item){
  let productos = getProductoDeStorage();
  productos.push(item);
  localStorage.setItem('productos', JSON.stringify(productos));
  subirCarrito();
}

//Agarrar todos los productos info de algun local storage.
function getProductoDeStorage(){
  return localStorage.getItem('productos')?JSON.parse
  (localStorage.getItem('productos')): [];
  //retorna array vacio si no tiene algun producto.
}

//Cargar productoCarrito
function cargarCarrito(){
  let productos = getProductoDeStorage();
  if(productos.length < 1){
    cartItemID = 1; // Si el carrito no tiene productos en el local storage
  } else {
    cartItemID = productos[productos.length - 1].id;
    cartItemID++;
    // sino, obtiene la id del producto y lo incrementa.
  }
  // console.log(cartItemID); ver en consola el aumento
  productos.forEach(product => addToCartList(product));

  //calcular y subir
  subirCarrito()
}

// Calcular el total
function findCartInfo(){
  let productos = getProductoDeStorage();
  let total = productos.reduce((acc, product) => {
    let precio = parseFloat(product.precio.substr(1)); //borrar precio
    return acc += precio;
  }, 0); // añadir todos los precios

  return{
    total: total.toFixed(2),
    productoContador: productos.length // añade productos al contador
  }
}

// borrar prodcuto de lista
function borrarProducto(e){
  let cartItem;
  if(e.target.tagName === "BUTTON"){
    cartItem = e.target.parentElement;
    cartItem.remove(); // borra solo desde DOM
  }else if(e.target.tagName === "I"){
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove(); // borra solo desde DOM
  }
 
  let productos = getProductoDeStorage();
  let subirProductos = productos.filter(product => {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem('productos', JSON.stringify(subirProductos));// subir producto lista despúes de borrar
  subirCarrito();
}