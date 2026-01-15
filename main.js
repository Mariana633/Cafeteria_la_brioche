document.addEventListener("DOMContentLoaded", () => {
  console.log("Sitio cargado correctamente ☕");

  /* ======================
     BUSCADOR (OVERLAY) – FUNCIONAL
  ====================== */
  const searchIcon = document.getElementById("searchIcon");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchBtnAction = document.getElementById("searchBtnAction");

  if (searchIcon && searchOverlay) {
    searchIcon.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      searchInput.focus();
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove("active");
      }
    });
  }

  function getProductsFromHTML() {
    const cards = document.querySelectorAll(".product-card, .producto-card");

    return Array.from(cards).map(card => ({
      name: card.querySelector("h3")?.textContent.trim() || "",
      price: card.querySelector(".price, .producto-precio")?.textContent.trim() || "",
      image: card.querySelector("img")?.src || "",
      element: card
    }));
  }

  function renderSearchResults(results) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML = "<p>No se encontraron productos</p>";
      return;
    }

    results.forEach(p => {
      const item = document.createElement("div");

      // 👇 CLASE CORRECTA (la que ya tienes en CSS)
      item.classList.add("search-item");

      item.innerHTML = `
  <img src="${p.image}" alt="${p.name}">
  <div class="search-info">
    <strong>${p.name}</strong>
    <span>${p.price}</span>
  </div>
  <button class="btn-agregar">
    <span class="material-symbols-outlined">add</span>
    Agregar
  </button>
`;

      /* BOTÓN AGREGAR (usa el botón real del producto) */
      const addBtn = item.querySelector(".btn-agregar");
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const realButton = p.element.querySelector("button");
        if (realButton) realButton.click();
      });

      /* Click en resultado → baja al producto */
      item.addEventListener("click", () => {
        searchOverlay.classList.remove("active");
        p.element.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      searchResults.appendChild(item);
    });
  }



  /* ======================
     LÓGICA BUSCADOR
  ====================== */
  const allProducts = getProductsFromHTML();

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
      searchResults.innerHTML = "";
      return;
    }

    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    renderSearchResults(filtered);
  });

  /* ======================
     RESERVAS
  ====================== */
  const btnReservas = document.getElementById("btnReservas");
  const reservasSection = document.getElementById("reservas");
  const cerrarReservas = document.getElementById("cerrarReservas");

  if (btnReservas && reservasSection) {
    btnReservas.addEventListener("click", (e) => {
      e.preventDefault();
      reservasSection.classList.add("active");
      reservasSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (cerrarReservas && reservasSection) {
    cerrarReservas.addEventListener("click", () => {
      reservasSection.classList.remove("active");
    });
  }

  /* ======================
     TOAST
  ====================== */
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  /* ======================
     CARRITO
  ====================== */
  const cartBtn = document.getElementById("cartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartItemsEl || !cartTotal || !cartCount) return;

    cartItemsEl.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.qty;
      count += item.qty;

      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <div>${item.name} x${item.qty}<br><span>$${item.price * item.qty}</span></div>
          <div class="remove" onclick="removeItem('${item.name}')">✖</div>
        </div>
      `;
    });

    cartTotal.textContent = `$${total}`;
    cartCount.textContent = count;
  }

  window.removeItem = function (name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
  };

  function addToCart(name, price) {
    const item = cart.find(p => p.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, qty: 1 });

    saveCart();
    renderCart();
    showToast(`"${name}" agregado al carrito`);
  }

  document.querySelectorAll("button[data-name][data-price]").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.name, Number(btn.dataset.price));
    });
  });

  renderCart();

  /* ======================
     SLIDER TESTIMONIOS
  ====================== */
  const track = document.querySelector(".testimonials-track");
  if (track) {
    let items = track.querySelectorAll(".testimonial-item");
    let index = 0;
    let itemWidth = items[0].offsetWidth + 24;

    items.forEach(item => track.appendChild(item.cloneNode(true)));
    items = track.querySelectorAll(".testimonial-item");

    setInterval(() => {
      index++;
      track.style.transition = "transform 0.6s ease";
      track.style.transform = `translateX(-${index * itemWidth}px)`;

      if (index >= items.length / 2) {
        setTimeout(() => {
          track.style.transition = "none";
          index = 0;
          track.style.transform = "translateX(0)";
        }, 500);
      }
    }, 2500);
  }
});