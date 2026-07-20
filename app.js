/* ================================================
   APP.JS — Lógica de la Tienda SPA
   ================================================ */

(function () {
  'use strict';

  /* ============================================
     DATOS: Productos del catálogo
     (Simula los datos que sube el administrador)
     ============================================ */
  const PRODUCTS = [
    {
      id: 1,
      name: 'Remera Esencial',
      description: 'Algodón premium 100%. Corte recto clásico con acabado suave al tacto.',
      price: 18500,
      image: '',
      badge: 'Nuevo',
      colors: ['Negro', 'Blanco', 'Gris Oxford'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      id: 2,
      name: 'Hoodie Oversize',
      description: 'Felpa interior gruesa. Capucha doble capa con cordones planos.',
      price: 34900,
      image: '',
      badge: '',
      colors: ['Negro', 'Gris Oscuro', 'Blanco Hueso'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 3,
      name: 'Jogger Urbano',
      description: 'Tela frisa premium con puños elastizados. Bolsillos laterales con cierre.',
      price: 27500,
      image: '',
      badge: '',
      colors: ['Negro', 'Gris Oxford', 'Beige'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      id: 4,
      name: 'Campera Liviana',
      description: 'Corte regular, cierre frontal y cuello alto. Ideal para entretiempo.',
      price: 42000,
      image: '',
      badge: 'Popular',
      colors: ['Negro', 'Oliva', 'Gris'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 5,
      name: 'Musculosa Training',
      description: 'Tejido transpirable de secado rápido. Perfecta para entrenamiento.',
      price: 14500,
      image: '',
      badge: '',
      colors: ['Negro', 'Blanco', 'Gris'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 6,
      name: 'Bermuda Classic',
      description: 'Gabardina liviana con cintura elástica. Largo sobre la rodilla.',
      price: 21000,
      image: '',
      badge: 'Nuevo',
      colors: ['Negro', 'Beige', 'Gris Oxford'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
  ];

  /* ============================================
     DATOS: Cupones de descuento
     (Creados desde el panel de administración)
     ============================================ */
  const COUPONS = {
    'BIENVENIDO10': { discount: 10, type: 'percent', label: '10% de descuento' },
    'LANZAMIENTO20': { discount: 20, type: 'percent', label: '20% de descuento' },
    'ENVIOGRATIS': { discount: 5000, type: 'fixed', label: '$5.000 de descuento' },
  };

  /* ============================================
     ESTADO GLOBAL
     ============================================ */
  let cart = [];
  let appliedCoupon = null;

  /* ============================================
     ELEMENTOS DEL DOM
     ============================================ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const productsGrid = $('#products-grid');
  const cartSidebar = $('#cart-sidebar');
  const cartOverlay = $('#cart-overlay');
  const cartItemsEl = $('#cart-items');
  const cartEmptyMsg = $('#cart-empty-msg');
  const cartCountEl = $('#cart-count');
  const cartSubtotalEl = $('#cart-subtotal');
  const cartDiscountEl = $('#cart-discount');
  const cartTotalEl = $('#cart-total');
  const discountLine = $('#discount-line');
  const discountLabel = $('#discount-label');
  const couponInput = $('#coupon-input');
  const couponApplyBtn = $('#coupon-apply-btn');
  const couponMsg = $('#coupon-msg');
  const checkoutBtn = $('#checkout-btn');
  const cartToggleBtn = $('#cart-toggle-btn');
  const cartCloseBtn = $('#cart-close-btn');
  const cartFooter = $('#cart-footer');
  const mobileMenuBtn = $('#mobile-menu-btn');
  const navLinks = $('#nav-links');
  const mainHeader = $('#main-header');

  /* ============================================
     INICIALIZACIÓN
     ============================================ */
  function init() {
    renderProducts();
    bindEvents();
    updateCartUI();
    handleScrollSpy();
  }

  /* ============================================
     RENDERIZAR PRODUCTOS EN EL CATÁLOGO
     ============================================ */
  function renderProducts() {
    productsGrid.innerHTML = PRODUCTS.map((product) => {
      const colorOptions = product.colors
        .map((c) => `<option value="${c}">${c}</option>`)
        .join('');

      const sizeOptions = product.sizes
        .map((s) => `<option value="${s}">${s}</option>`)
        .join('');

      const badgeHTML = product.badge
        ? `<span class="product-badge">${product.badge}</span>`
        : '';

      // Genera un placeholder SVG con las iniciales del producto
      const initials = product.name.split(' ').map(w => w[0]).join('').substring(0, 2);
      const placeholderSVG = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
          <rect fill="#e8e8e4" width="400" height="500"/>
          <text x="200" y="260" font-family="Arial,sans-serif" font-size="64" font-weight="bold" fill="#b0b0a8" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        </svg>`
      )}`;

      const imgSrc = product.image || placeholderSVG;

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-img-wrapper">
            <img src="${imgSrc}" alt="${product.name}" class="product-img" loading="lazy" />
            ${badgeHTML}
          </div>
          <div class="product-body">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <span class="product-price">${formatPrice(product.price)}</span>

            <div class="product-options">
              <div class="option-group">
                <label class="option-label" for="color-${product.id}">Color</label>
                <select class="option-select" id="color-${product.id}">
                  ${colorOptions}
                </select>
              </div>
              <div class="option-group">
                <label class="option-label" for="size-${product.id}">Talle</label>
                <select class="option-select" id="size-${product.id}">
                  ${sizeOptions}
                </select>
              </div>
            </div>

            <button class="add-to-cart-btn" data-id="${product.id}">
              Añadir al carrito
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  /* ============================================
     EVENTOS
     ============================================ */
  function bindEvents() {
    // Añadir al carrito — delegación de eventos
    productsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;
      handleAddToCart(btn);
    });

    // Abrir / cerrar carrito
    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Eventos dentro del carrito — delegación
    cartItemsEl.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.cart-item-remove');
      if (removeBtn) {
        const uid = removeBtn.dataset.uid;
        removeFromCart(uid);
        return;
      }

      const qtyBtn = e.target.closest('.qty-btn');
      if (qtyBtn) {
        const uid = qtyBtn.dataset.uid;
        const action = qtyBtn.dataset.action;
        changeQty(uid, action);
      }
    });

    // Cupón
    couponApplyBtn.addEventListener('click', applyCoupon);
    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyCoupon();
    });

    // Menú móvil
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Cerrar menú móvil al hacer clic en un enlace
    $$('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Scroll → header sólido + active link
    window.addEventListener('scroll', handleScrollSpy, { passive: true });

    // Cerrar carrito con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        closeCart();
      }
    });
  }

  /* ============================================
     AÑADIR AL CARRITO
     ============================================ */
  function handleAddToCart(btn) {
    const productId = parseInt(btn.dataset.id, 10);
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const card = btn.closest('.product-card');
    const color = card.querySelector(`#color-${productId}`).value;
    const size = card.querySelector(`#size-${productId}`).value;

    // Verificar si ya existe en el carrito con las mismas opciones
    const existingItem = cart.find(
      (item) => item.productId === productId && item.color === color && item.size === size
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        uid: generateUID(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color,
        size,
        qty: 1,
      });
    }

    // Feedback visual en el botón
    const originalText = btn.textContent;
    btn.textContent = '✓ Añadido';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('added');
    }, 1200);

    updateCartUI();
    showToast(`${product.name} añadido al carrito`);
  }

  /* ============================================
     ELIMINAR DEL CARRITO
     ============================================ */
  function removeFromCart(uid) {
    cart = cart.filter((item) => item.uid !== uid);
    // Si se vació el carrito, limpiar cupón
    if (cart.length === 0) {
      appliedCoupon = null;
      couponInput.value = '';
      couponMsg.textContent = '';
      couponMsg.className = 'coupon-msg';
    }
    updateCartUI();
  }

  /* ============================================
     CAMBIAR CANTIDAD
     ============================================ */
  function changeQty(uid, action) {
    const item = cart.find((i) => i.uid === uid);
    if (!item) return;

    if (action === 'increase') {
      item.qty += 1;
    } else if (action === 'decrease') {
      item.qty -= 1;
      if (item.qty <= 0) {
        removeFromCart(uid);
        return;
      }
    }

    updateCartUI();
  }

  /* ============================================
     APLICAR CUPÓN
     ============================================ */
  function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
      showCouponMsg('Ingresa un código de cupón.', 'error');
      return;
    }

    if (cart.length === 0) {
      showCouponMsg('Añade productos al carrito primero.', 'error');
      return;
    }

    const coupon = COUPONS[code];
    if (!coupon) {
      showCouponMsg('Código inválido. Intenta otro.', 'error');
      appliedCoupon = null;
    } else {
      appliedCoupon = { code, ...coupon };
      showCouponMsg(`¡Cupón aplicado! ${coupon.label}`, 'success');
    }

    updateCartUI();
  }

  function showCouponMsg(msg, type) {
    couponMsg.textContent = msg;
    couponMsg.className = `coupon-msg ${type}`;
  }

  /* ============================================
     ACTUALIZAR TODA LA UI DEL CARRITO
     ============================================ */
  function updateCartUI() {
    // --- Contador ---
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.classList.toggle('visible', totalItems > 0);

    // --- Items lista ---
    if (cart.length === 0) {
      cartEmptyMsg.style.display = 'block';
      cartFooter.style.display = 'none';
      // Limpiar items renderizados
      const existingItems = cartItemsEl.querySelectorAll('.cart-item');
      existingItems.forEach((el) => el.remove());
    } else {
      cartEmptyMsg.style.display = 'none';
      cartFooter.style.display = 'block';
      renderCartItems();
    }

    // --- Totales ---
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discountAmount = 0;

    if (appliedCoupon && cart.length > 0) {
      if (appliedCoupon.type === 'percent') {
        discountAmount = Math.round(subtotal * (appliedCoupon.discount / 100));
      } else if (appliedCoupon.type === 'fixed') {
        discountAmount = Math.min(appliedCoupon.discount, subtotal);
      }
      discountLine.style.display = 'flex';
      discountLabel.textContent = `Descuento (${appliedCoupon.label})`;
      cartDiscountEl.textContent = `-${formatPrice(discountAmount)}`;
    } else {
      discountLine.style.display = 'none';
    }

    const total = subtotal - discountAmount;
    cartSubtotalEl.textContent = formatPrice(subtotal);
    cartTotalEl.textContent = formatPrice(total);

    // Habilitar/deshabilitar botón de checkout
    checkoutBtn.disabled = cart.length === 0;
  }

  /* ============================================
     RENDERIZAR ITEMS DEL CARRITO
     ============================================ */
  function renderCartItems() {
    // Limpiar items existentes pero mantener el mensaje vacío
    const existingItems = cartItemsEl.querySelectorAll('.cart-item');
    existingItems.forEach((el) => el.remove());

    cart.forEach((item) => {
      // Generar placeholder SVG para la miniatura
      const initials = item.name.split(' ').map(w => w[0]).join('').substring(0, 2);
      const placeholderSVG = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="68" height="82" viewBox="0 0 68 82">
          <rect fill="#e8e8e4" width="68" height="82"/>
          <text x="34" y="44" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="#b0b0a8" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        </svg>`
      )}`;
      const imgSrc = item.image || placeholderSVG;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-details">${item.color} · Talle ${item.size}</span>
          <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
        </div>
        <div class="cart-item-actions">
          <button class="cart-item-remove" data-uid="${item.uid}">Eliminar</button>
          <div class="qty-controls">
            <button class="qty-btn" data-uid="${item.uid}" data-action="decrease" aria-label="Disminuir cantidad">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-uid="${item.uid}" data-action="increase" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });
  }

  /* ============================================
     ABRIR / CERRAR CARRITO
     ============================================ */
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ============================================
     SCROLL SPY — Nav links activos + header
     ============================================ */
  function handleScrollSpy() {
    const scrollY = window.scrollY;

    // Header efecto sólido
    mainHeader.classList.toggle('scrolled', scrollY > 50);

    // Secciones
    const sections = ['home', 'catalogo'];
    let currentSection = 'home';

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          currentSection = id;
        }
      }
    });

    $$('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  /* ============================================
     TOAST NOTIFICATION
     ============================================ */
  function showToast(message) {
    // Reutilizar o crear el toast
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    // Forzar reflow para reiniciar animación
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  /* ============================================
     UTILIDADES
     ============================================ */
  function formatPrice(cents) {
    return '$' + cents.toLocaleString('es-AR');
  }

  function generateUID() {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }

  /* ============================================
     INICIAR LA APP
     ============================================ */
  document.addEventListener('DOMContentLoaded', init);
})();
