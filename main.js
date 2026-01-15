document.addEventListener("DOMContentLoaded", () => {
  console.log("Hero de cafetería cargado ☕");





/* ======================
   BUSCADOR (OVERLAY)
====================== */
const searchIcon    = document.getElementById("searchIcon");   // botón del header
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch   = document.getElementById("closeSearch");
const searchInput   = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Solo para verificar en consola:
console.log("searchIcon:", searchIcon);
console.log("searchOverlay:", searchOverlay);

/* Abrir overlay al hacer click en la lupa */
if (searchIcon && searchOverlay) {
  searchIcon.addEventListener("click", () => {
    console.log("Click en lupa");
    searchOverlay.classList.add("active");
    if (searchInput) searchInput.focus();
  });
}

/* Cerrar con la X */
if (closeSearch && searchOverlay) {
  closeSearch.addEventListener("click", () => {
    searchOverlay.classList.remove("active");
  });
}

/* Cerrar haciendo click fuera de la caja blanca */
if (searchOverlay) {
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove("active");
    }
  });
}

/* (Opcional) Filtrar mientras escribes si más adelante usas `products` */
if (
  searchInput &&
  searchResults &&
  typeof products !== "undefined" &&
  typeof renderSearchResults === "function"
) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    renderSearchResults(filtered);
  });
}


const searchBtnAction = document.getElementById("searchBtnAction");

if (searchBtnAction && searchInput && searchResults) {
  searchBtnAction.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    
    if (!query.trim()) return;

    if (typeof products !== "undefined" && typeof renderSearchResults === "function") {
      const filtered = products.filter(p => p.name.toLowerCase().includes(query));
      renderSearchResults(filtered);
    }
  });
}



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

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* ======================
     CARRITO
  ====================== */
  const cartBtn     = document.getElementById("cartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCount   = document.getElementById("cartCount");
  const cartTotal   = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /* Abrir carrito */
  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener("click", () => {
      cartOverlay.classList.add("active");
    });
  }

  /* Cerrar carrito al hacer click fuera o en botón .close-cart */
  if (cartOverlay) {
    cartOverlay.addEventListener("click", (e) => {
      if (e.target === cartOverlay || e.target.classList.contains("close-cart")) {
        cartOverlay.classList.remove("active");
      }
    });
  }

  /* ======================
     FUNCIONES CARRITO
  ====================== */
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
          <div>
            ${item.name} x${item.qty}<br>
            <span>$${item.price * item.qty}</span>
          </div>
          <div class="remove" onclick="removeItem('${item.name}')">✖</div>
        </div>
      `;
    });

    cartTotal.textContent = `$${total}`;
    cartCount.textContent = count;
  }

  // Quitar item con la X
  window.removeItem = function (name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
  };

  /* Añadir producto al carrito (función genérica) */
  function addToCart(name, price) {
    if (!name || isNaN(price)) return;

    const item = cart.find(p => p.name === name);
    if (item) {
      item.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    saveCart();
    renderCart();
    showToast(`"${name}" agregado al carrito`);
  }

  /* Enganchar TODOS los botones que tienen data-name y data-price */
  function bindCartButtons(root = document) {
    const buttons = root.querySelectorAll('button[data-name][data-price]');

    buttons.forEach(btn => {
      if (btn.dataset.cartBound === "1") return;
      btn.dataset.cartBound = "1";

      btn.addEventListener("click", () => {
        const name  = btn.dataset.name;
        const price = Number(btn.dataset.price);
        addToCart(name, price);
      });
    });
  }

  // Enganchar botones iniciales (favoritos + secciones)
  bindCartButtons();

  /* ========================
      CONFIRMAR COMPRA (delegado)
  ======================== */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".checkout");
    if (!btn) return;

    e.stopPropagation();
    console.log("CLICK EN COMPRAR (delegado)");

    if (cart.length === 0) {
      showToast("Tu carrito está vacío");
      return;
    }

    cart = [];
    saveCart();
    renderCart();

    if (cartOverlay) {
      cartOverlay.classList.remove("active");
    }

    showToast("¡Gracias por tu compra! ☕");
  });

  /* ======================
     MOSTRAR / OCULTAR SECCIONES DE PRODUCTOS
  ====================== */
  const botonesVer = document.querySelectorAll('.btn-ver-productos');
  const secciones  = document.querySelectorAll('.productos-section');

  botonesVer.forEach(boton => {
    boton.addEventListener('click', function () {
      const targetId = this.dataset.target;

      secciones.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.add('mostrar');
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          sec.classList.remove('mostrar');
        }
      });

      bindCartButtons();
    });
  });

  /* ======================
     SLIDER DE TESTIMONIOS
  ====================== */
  const track = document.querySelector('.testimonials-track');
  let items = track ? track.querySelectorAll('.testimonial-item') : [];

  if (track && items.length > 0) {
    let index = 0;
    let itemWidth = items[0].offsetWidth + 24;

    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    items = track.querySelectorAll('.testimonial-item');

    function moveSlider() {
      index++;
      track.style.transition = 'transform 0.6s ease';
      track.style.transform = `translateX(-${index * itemWidth}px)`;

      if (index >= items.length / 2) {
        setTimeout(() => {
          track.style.transition = 'none';
          index = 0;
          track.style.transform = 'translateX(0)';
        }, 500);
      }
    }

    setInterval(moveSlider, 2000);

    window.addEventListener('resize', () => {
      if (items[0]) {
        itemWidth = items[0].offsetWidth + 24;
      }
    });

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none';
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      track.style.transform = `translateX(-${index * itemWidth + diff}px)`;
    });

    track.addEventListener('touchend', () => {
      isDragging = false;
      track.style.transition = 'transform 0.3s ease';
    });
  }

  /* ======================
     INICIALIZAR CARRITO
  ====================== */
  renderCart();
});

/* ======================
   MENSAJE DE COMPRA ABAJO (opcional)
====================== */
function showPurchaseMessage(text) {
  let msg = document.getElementById("purchaseMessage");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "purchaseMessage";
    document.body.appendChild(msg);
  }

  msg.textContent = text;
  msg.classList.add("visible");

  setTimeout(() => {
    msg.classList.remove("visible");
  }, 4000);
}
