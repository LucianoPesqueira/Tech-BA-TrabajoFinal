const products = [
    {
        id: '01',
        image: 'image/zapatillas-de-running-adidas-response-super-negra.png',
        name: 'Adidas Response',
        stars: 5,
        rating: '5.0',
        category: 'Running',
        description: 'Zapatilla de running Adidas Response super negra',
        price: 95.500
    },
    {
        id: '02',
        image: 'image/zapatillas-running-adidas-duramo-10-wide-mujer-negra.png',
        name: 'Adidas Duramo',
        stars: 5,
        rating: '5.0',
        category: 'Running',
        description: 'Zapatilla de running Adidas duramo 10 wide de mujer',
        price: 68.750
    },
    {
        id: '03',
        image: 'image/zapatilla-adidas-mujer-switch-run-livianas.png',
        name: 'Adidas Switch Run',
        stars: 3.5,
        rating: '3.5',
        category: 'Running',
        description: 'Zapatilla de running Adidas switch run livianas',
        price: 58.790
    },
    {
        id: '04',
        image: 'image/zapatillas-puma-caven-2-0.png',
        name: 'Puma Caven',
        stars: 5,
        rating: '5.0',
        category: 'Moda',
        description: 'Zapatilla de moda Puma caven 2.0',
        price: 83.750
    },
    {
        id: '05',
        image: 'image/zapatilla-atomik-reece-mujer.png',
        name: 'Atomic Reece',
        stars: 2,
        rating: '2.0',
        category: 'Moda',
        description: 'Zapatilla de moda Atomic reece de mujer',
        price: 71.750
    },
    {
        id: '06',
        image: 'image/zapatillas-adidas-response-mujer.png',
        name: 'Adidas Response',
        stars: 5,
        rating: '5.0',
        category: 'Running',
        description: 'Zapatilla de running Adidas response de mujer',
        price: 80.500
    },
    {
        id: '07',
        image: 'image/ojotas-adidas-adilette-aqua.png',
        name: 'Adidas Adilette',
        stars: 5,
        rating: '5.0',
        category: 'Moda',
        description: 'Ojotas Adidas adilette aqua',
        price: 50.000
    },
    {
        id: '08',
        image: 'image/ojotas-salomon-rx-slide-3.png',
        name: 'Salomon RX Slide',
        stars: 4.5,
        rating: '4.5',
        category: 'Moda',
        description: 'Ojotas Salomon rx slide 3',
        price: 53.800
    }
];

//declaro el carrito
let cart = [];

//generar las estrellas de calificacion
function generateStarsHTML(stars) {
    let html = '';
    for (let i = 0; i < 5; i++) {
        if (stars >= i + 1) {
            html += `<i class="fa-solid fa-star"></i>`;//completa
        } else if (stars >= i + 0.5) {
            html += `<i class="fa-solid fa-star-half"></i>`;//media
        } else {
            html += `<i class="fa-regular fa-star"></i>`;//vacia
        }
    }
    return html;
}

//actualiza la cantidad de productos del boton carrito del header
function updateCartCounter() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let totalUnique = cart.length;

    //selecciono el span del contador del carrito
    const counter = document.getElementById('cart-counter');

    //si tiene productos lo muestro
    if (totalUnique > 0) {
        counter.textContent = totalUnique;
        counter.style.display = 'inline-block';
    } else {
        counter.style.display = 'none';
    }
}

//muestra u oculta el modal del carrito de compras
document.getElementById('cart-shopping').addEventListener('click', () => {
    const modal = document.getElementById('modal-cart');
    modal.classList.toggle('hidden');
});


//funcion que recibe el id del producto seleccionado, lo añade al carrito o aumenta su cantidad
function addProductCart(idProduct) {
    let productInCart = null;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === idProduct) {
            productInCart = cart[i];
            break;
        }
    }

    if (productInCart) {
        productInCart.qty++;//si ya existe el producto, incrementa la cantidad +1
    } else {
        let newProduct = null;//creo variable que contendra el producto nuevo al carrito
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === idProduct) {
                newProduct = products[i];
                break;
            }
        }

        cart.push({ ...newProduct, qty: 1 });//hago la copia del producto y le agrego la cantidad
    }

    //almacenar en storage el carrito actualizado
    sessionStorage.setItem('cart', JSON.stringify(cart));

    updateCartHTML(); //llamo a la funcion para actualizar la vista del carrito
    updateCartCounter();//actualizo el numero de productos en el boton carrito
}

//manejar el click de compra
function handleClickBuy(event) {
    const productId = event.target.dataset.id;
    addProductCart(productId);
}

//funcion para agregar los productos al HTML
function appendProduct() {
    const divProduct = document.getElementById("product-container");

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const starsHTML = generateStarsHTML(product.stars);

        divProduct.insertAdjacentHTML('beforeend',
            `
            <div class="product">
                <img src="${product.image}" alt="${product.name}" width="200">
                <div class="productRating">
                    <div class="stars">${starsHTML}</div>
                    <input type="text" value="${product.rating}" readonly>
                </div>
                <h5>${product.category}</h5>
                <h4>${product.description}</h4>
                <div class="priceButton">
                    <span>Precio: $${product.price.toLocaleString("es-AR")}</span>
                    <button class="btn-buy" type="button" data-id="${product.id}">
                      Comprar <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
            `
        );
    }

    divProduct.addEventListener("click", function (event) {
        if (event.target.classList.contains('btn-buy')) {
            handleClickBuy(event);
        }
    });
}

//manejo los botones restar, sumar y eliminar
function manageClickCart(event) {
    const target = event.target.closest('button');//capturo el boton, evita que no me tome el click sobre el icono(closest)

    if (!target) return; //sale si no lo encuentra

    if (target.classList.contains("btn-operation") || target.classList.contains("btn-delete")) {
        const productId = target.dataset.id;
        const action = target.dataset.action;

        if (action === "subtract") {
            subtractProductCart(productId);
        } else if (action === "add") {
            addQtyProductCart(productId);
        } else if (action === "delete") {
            deleteProductCart(productId);
        }
    }
}

//actualizo el contenido HTML del carrito --> cart
function updateCartHTML() {
    const cartShopping = document.getElementById('modal-cart');

    if (!cartShopping) {
        console.error("Error: No se encontro el modal del carrito modal-cart");
        return;
    }

    //estructura base del carrito
    cartShopping.innerHTML = `
        <button id="btn-close-cart" class="close-cart">×</button>
        <h2 id="title-cart">Carrito de Compras</h2>
        <ul class="cart-list"></ul>
        <p class="cart-total"></p>
        <p class="cart-qty"></p>
    `;

    const cartList = cartShopping.querySelector('.cart-list');
    const cartTotal = cartShopping.querySelector('.cart-total');
    const cartQty = cartShopping.querySelector('.cart-qty');

    let totalPay = 0;
    let qtyUniqueProduct = 0;

    if (cart.length === 0) {
        cartList.innerHTML = "<li>El carrito se encuentra vacio.</li>";
    } else {
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.name} - $${item.price} x ${item.qty}</span>
                <div class="operation-cart">
                    <button id="btn-sub" class="btn-operation" data-id="${item.id}" data-action="subtract">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <button id="btn-add" class="btn-operation" data-id="${item.id}" data-action="add">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button id="btn-del" class="btn-delete" data-id="${item.id}" data-action="delete">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartList.appendChild(li);
            totalPay += item.price * item.qty;
            qtyUniqueProduct++;
        }
    }
    cartTotal.textContent = `Total a pagar: $${totalPay.toFixed(2)}`;
    cartQty.textContent = `Productos en carrito: ${qtyUniqueProduct}`;

    //delegacion de eventos
    cartList.addEventListener("click", manageClickCart);

    document.getElementById('btn-close-cart').addEventListener('click', () => {
        document.getElementById('modal-cart').classList.add('hidden');
    });
}

//funcion restar producto
function subtractProductCart(productId) {
    let productInCart = cart.find(p => p.id === productId);

    if (productInCart) {
        productInCart.qty--;

        if (productInCart.qty <= 0) {
            deleteProductCart(productId); //elimino el producto si llega a 0
        } else {
            sessionStorage.setItem('cart', JSON.stringify(cart));
            updateCartHTML(); //actualizo la vista
            updateCartCounter();
        }
    }
}

//funcion sumar producto
function addQtyProductCart(productId) {
    let productInCart = cart.find(p => p.id === productId);

    if (productInCart) {
        productInCart.qty++;

        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartHTML();
        updateCartCounter();
    }
}

//funcion eliminar productos
function deleteProductCart(productId) {
    const newCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartHTML();
    updateCartCounter();
}

//cuando el DOM esta cargado
document.addEventListener('DOMContentLoaded', function () {
    cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    appendProduct();
    updateCartHTML();
    updateCartCounter();
});

