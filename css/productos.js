const products = {
    deportes: [
        { name: "Pelota", price: "$20", image: "https://via.placeholder.com/150" },
        { name: "Raqueta", price: "$50", image: "https://via.placeholder.com/150" }
    ],
    electronica: [
        { name: "Laptop", price: "$900", image: "https://via.placeholder.com/150" }
    ]
};

document.querySelectorAll(".category-card").forEach(card => card.addEventListener("click",e=>{
    e.stopPropagation();
const category = card.getAttribute("data-category");
const productsContainer = document.getElementById("products-container");
const productsGrid = document.getElementById("products-grid");

// Limpiar productos anteriores
productsGrid.innerHTML = "";

// Verificar si la categoría tiene productos
if (products[category]) {
    products[category].forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
        `;
        productsGrid.appendChild(productCard);
    });
    // Mostrar contenedor de productos
    productsContainer.style.display = "block";
    productsContainer.scrollIntoView({ behavior: "smooth" });
} else {
    productsGrid.innerHTML = "<p>No hay productos disponibles en esta categoría.</p>";
    productsContainer.style.display = "block";
}
}));