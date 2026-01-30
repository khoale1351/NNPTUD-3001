const API_URL = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filteredProducts = [];

let currentPage = 1;
let pageSize = 10;

let priceAsc = true;
let titleAsc = true;

// ================= GET ALL =================
async function getAllProducts() {
    const res = await fetch(API_URL);
    products = await res.json();
    filteredProducts = [...products];
    render();
}

getAllProducts();

// ================= RENDER =================
function render() {
    renderTable();
    renderPagination();
}

function renderTable() {
    const tbody = document.getElementById("productBody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    const pageData = filteredProducts.slice(start, end);

    pageData.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>
                    <img src="${p.images[0]}" alt="${p.title}">
                </td>
                <td>${p.title}</td>
                <td>${p.price}</td>
            </tr>
        `;
    });
}

// ================= SEARCH =================
document.getElementById("searchInput").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );

    currentPage = 1;
    render();
});

// ================= PAGE SIZE =================
document.getElementById("pageSize").addEventListener("change", function () {
    pageSize = +this.value;
    currentPage = 1;
    render();
});

// ================= PAGINATION =================
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <button 
                class="${i === currentPage ? "active" : ""}"
                onclick="goToPage(${i})"
            >
                ${i}
            </button>
        `;
    }
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

// ================= SORT =================
function sortByPrice() {
    filteredProducts.sort((a, b) =>
        priceAsc ? a.price - b.price : b.price - a.price
    );
    priceAsc = !priceAsc;
    renderTable();
}

function sortByTitle() {
    filteredProducts.sort((a, b) =>
        titleAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    );
    titleAsc = !titleAsc;
    renderTable();
}
