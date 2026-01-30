const API_URL = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filteredProducts = [];

let currentPage = 1;
let pageSize = 10;

let priceAsc = true;
let titleAsc = true;

const loadingEl = document.getElementById("loading");

// ================= GET ALL =================
async function getAllProducts() {
    showLoading(true);

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        products = data.map(p => ({
            ...p,
            image:
                Array.isArray(p.images) && p.images.length > 0
                    ? p.images[0]
                    : ""
        }));

        filteredProducts = [...products];
        currentPage = 1;
        render();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu");
    } finally {
        showLoading(false);
    }
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

    filteredProducts.slice(start, end).forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>
                    <img
                        src="${p.image}"
                        alt="${p.title}"
                        referrerpolicy="no-referrer"
                        onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=No+Image';"
                    >
                </td>
                <td class="title" title="${p.title}">
                    ${p.title}
                </td>
                <td>${p.category?.name || ""}</td>
                <td>${p.price}</td>
            </tr>
        `;
    });
}

// ================= DEBOUNCE SEARCH =================
let searchTimeout = null;

document.getElementById("searchInput").addEventListener("input", function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const keyword = this.value.trim().toLowerCase();

        filteredProducts = products.filter(p =>
            p.title.toLowerCase().includes(keyword)
        );

        currentPage = 1;
        render();
    }, 400);
});

// ================= PAGE SIZE =================
document.getElementById("pageSize").addEventListener("change", function () {
    pageSize = Number(this.value);
    currentPage = 1;
    render();
});

// ================= PAGINATION =================
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

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
    render();
}

// ================= SORT =================
function sortByPrice() {
    filteredProducts.sort((a, b) =>
        priceAsc ? a.price - b.price : b.price - a.price
    );
    priceAsc = !priceAsc;
    currentPage = 1;
    render();
}

function sortByTitle() {
    filteredProducts.sort((a, b) =>
        titleAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    );
    titleAsc = !titleAsc;
    currentPage = 1;
    render();
}

// ================= LOADING =================
function showLoading(show) {
    loadingEl.classList.toggle("hidden", !show);
}
