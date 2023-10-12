let carrito = [];

document.addEventListener('DOMContentLoaded', fetchProductos);

function fetchProductos() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => renderizarProductos(data))
        .catch(error => console.error('Error al cargar los productos:', error));
}

function renderizarProductos(productos) {
    const contenedor = document.getElementById('productos');

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" width="150">
            <h3>${producto.nombre}</h3>
            <p>Precio: ${producto.precio} $</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        contenedor.appendChild(productoDiv);
    });
    calcularTotal();
}

function agregarAlCarrito(id) {
    const productoExistente = carrito.find(prod => prod.id === id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        fetch('productos.json')
            .then(response => response.json())
            .then(productos => {
                const productoSeleccionado = productos.find(prod => prod.id === id);
                if (productoSeleccionado) {
                    productoSeleccionado.cantidad = 1;
                    carrito.push(productoSeleccionado);
                    renderizarCarrito();
                }
            });
    }
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito');
    contenedor.innerHTML = '';
    carrito.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.innerHTML = `
            ${producto.nombre} - ${producto.precio} $ x ${producto.cantidad}
            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            <button onclick="incrementarCantidad(${producto.id})">+</button>
            <button onclick="decrementarCantidad(${producto.id})">-</button>
        `;
        contenedor.appendChild(productoDiv);
    });
    calcularTotal();
}

function eliminarProducto(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    renderizarCarrito();
}

function incrementarCantidad(id) {
    const producto = carrito.find(prod => prod.id === id);
    if (producto) {
        producto.cantidad++;
        renderizarCarrito();
    }
}

function decrementarCantidad(id) {
    const producto = carrito.find(prod => prod.id === id);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        renderizarCarrito();
    } else if (producto && producto.cantidad === 1) {
        eliminarProducto(id);
    }
}

function calcularTotal() {
    const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    document.getElementById('total').innerText = total;
}

function limpiarCarrito() {
    carrito = [];
    renderizarCarrito();
}
