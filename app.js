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
     DATOS: Diseños disponibles para personalizar
     ============================================ */
  const FRONT_DESIGNS = [
    { id: 'f-logo', name: 'Logo Minimal', price: 1500, previewChar: 'B' },
    { id: 'f-box', name: 'Fuerza Box', price: 2500, previewChar: 'F' },
    { id: 'f-kanji', name: 'Esencia', price: 3000, previewChar: '気' },
  ];

  const BACK_DESIGNS = [
    { id: 'b-crest', name: 'Brand Crest', price: 3500, previewChar: '🛡️' },
    { id: 'b-grand', name: 'Grandeza Skull', price: 4500, previewChar: '💀' },
    { id: 'b-script', name: 'Oxford Script', price: 4000, previewChar: '𝔅' },
  ];

  // Precios base para prendas personalizadas
  const CUST_BASE_PRICES = {
    'Canguro': 38000,
    'Manga Larga': 28000,
    'Remera': 19000
  };

  /* ============================================
     ESTADO GLOBAL
     ============================================ */
  let cart = [];
  let appliedCoupon = null;

  // Estado del personalizador
  let customizer = {
    currentStep: 1,
    type: 'Canguro',
    size: 'S',
    cut: 'Regular',
    color: 'Negro',
    frontDesignId: null,
    backDesignId: null,
    frontSimple: false,
    backSimple: false
  };

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

  // Elementos del Personalizador
  const openCustomizerBtn = $('#open-customizer-btn');
  const customizerOverlay = $('#customizer-overlay');
  const customizerModal = $('#customizer-modal');
  const customizerCloseBtn = $('#customizer-close-btn');
  
  const stepDots = $$('.step-dot');
  const customizerSteps = $$('.customizer-step');
  
  // Elementos Paso 1
  const custTypeSelect = $('#cust-type');
  const custSizeSelect = $('#cust-size');
  const custCutSelect = $('#cust-cut');
  const custColorSelect = $('#cust-color');
  const step1NextBtn = $('#cust-step1-next');

  // Elementos Paso 2
  const frontDesignsGrid = $('#front-designs-grid');
  const backDesignsGrid = $('#back-designs-grid');
  const frontSimpleCheckbox = $('#front-simple');
  const backSimpleCheckbox = $('#back-simple');
  const step2BackBtn = $('#cust-step2-back');
  const step2NextBtn = $('#cust-step2-next');

  // Elementos Paso 3
  const previewImgWrapper = $('#preview-img-wrapper');
  const previewName = $('#preview-name');
  const previewSummary = $('#preview-summary');
  const previewPrice = $('#preview-price');
  const custCancelBtn = $('#cust-cancel');
  const custConfirmBtn = $('#cust-confirm');

  /* ============================================
     INICIALIZACIÓN
     ============================================ */
  function init() {
    renderProducts();
    renderCustomizerOptions();
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
     RENDERIZAR DISEÑOS DISPONIBLES (PASO 2)
     ============================================ */
  function renderCustomizerOptions() {
    // Diseños Frontales
    frontDesignsGrid.innerHTML = FRONT_DESIGNS.map(design => {
      const designSVG = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <rect fill="#1c1c1e" width="100" height="100"/>
          <text x="50" y="55" font-family="Arial,sans-serif" font-size="28" fill="#d15b28" text-anchor="middle" dominant-baseline="middle">${design.previewChar}</text>
        </svg>`
      )}`;
      
      return `
        <div class="design-card" data-design-id="${design.id}" data-type="front">
          <img src="${designSVG}" alt="${design.name}" class="design-card-img" />
          <div class="design-card-name">${design.name}</div>
          <div class="selected-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      `;
    }).join('');

    // Diseños Posteriores
    backDesignsGrid.innerHTML = BACK_DESIGNS.map(design => {
      const designSVG = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <rect fill="#1c1c1e" width="100" height="100"/>
          <text x="50" y="55" font-family="Arial,sans-serif" font-size="28" fill="#d15b28" text-anchor="middle" dominant-baseline="middle">${design.previewChar}</text>
        </svg>`
      )}`;
      
      return `
        <div class="design-card" data-design-id="${design.id}" data-type="back">
          <img src="${designSVG}" alt="${design.name}" class="design-card-img" />
          <div class="design-card-name">${design.name}</div>
          <div class="selected-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ============================================
     EVENTOS
     ============================================ */
  function bindEvents() {
    // Catálogo & Carrito general
    productsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;
      handleAddToCart(btn);
    });

    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    cartItemsEl.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.cart-item-remove');
      if (removeBtn) {
        removeFromCart(removeBtn.dataset.uid);
        return;
      }

      const qtyBtn = e.target.closest('.qty-btn');
      if (qtyBtn) {
        changeQty(qtyBtn.dataset.uid, qtyBtn.dataset.action);
      }
    });

    couponApplyBtn.addEventListener('click', applyCoupon);
    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyCoupon();
    });

    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    $$('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    window.addEventListener('scroll', handleScrollSpy, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('open')) closeCart();
        if (customizerModal.classList.contains('open')) closeCustomizer();
      }
    });

    // --- Eventos del Personalizador ---
    openCustomizerBtn.addEventListener('click', openCustomizer);
    customizerCloseBtn.addEventListener('click', closeCustomizer);
    customizerOverlay.addEventListener('click', closeCustomizer);

    // Selección Paso 1
    custTypeSelect.addEventListener('change', (e) => { customizer.type = e.target.value; });
    custSizeSelect.addEventListener('change', (e) => { customizer.size = e.target.value; });
    custCutSelect.addEventListener('change', (e) => { customizer.cut = e.target.value; });
    custColorSelect.addEventListener('change', (e) => { customizer.color = e.target.value; });

    step1NextBtn.addEventListener('click', () => { goToStep(2); });

    // Selección Paso 2
    frontDesignsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.design-card');
      if (!card) return;
      selectDesign('front', card.dataset.designId);
    });

    backDesignsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.design-card');
      if (!card) return;
      selectDesign('back', card.dataset.designId);
    });

    frontSimpleCheckbox.addEventListener('change', (e) => {
      customizer.frontSimple = e.target.checked;
      if (e.target.checked) {
        customizer.frontDesignId = null;
        $$('.design-card[data-type="front"]').forEach(c => c.classList.remove('selected'));
      }
      validateStep2();
    });

    backSimpleCheckbox.addEventListener('change', (e) => {
      customizer.backSimple = e.target.checked;
      if (e.target.checked) {
        customizer.backDesignId = null;
        $$('.design-card[data-type="back"]').forEach(c => c.classList.remove('selected'));
      }
      validateStep2();
    });

    step2BackBtn.addEventListener('click', () => { goToStep(1); });
    step2NextBtn.addEventListener('click', () => {
      generatePreview();
      goToStep(3);
    });

    // Selección Paso 3
    custCancelBtn.addEventListener('click', closeCustomizer);
    custConfirmBtn.addEventListener('click', confirmCustomizerPurchase);
  }

  /* ============================================
     AÑADIR AL CARRITO DESDE CATÁLOGO
     ============================================ */
  function handleAddToCart(btn) {
    const productId = parseInt(btn.dataset.id, 10);
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const card = btn.closest('.product-card');
    const color = card.querySelector(`#color-${productId}`).value;
    const size = card.querySelector(`#size-${productId}`).value;

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
     LÓGICA DEL PERSONALIZADOR
     ============================================ */
  function openCustomizer() {
    // Resetear estado
    customizer = {
      currentStep: 1,
      type: custTypeSelect.value,
      size: custSizeSelect.value,
      cut: custCutSelect.value,
      color: custColorSelect.value,
      frontDesignId: null,
      backDesignId: null,
      frontSimple: false,
      backSimple: false
    };

    frontSimpleCheckbox.checked = false;
    backSimpleCheckbox.checked = false;
    $$('.design-card').forEach(c => c.classList.remove('selected'));
    
    goToStep(1);
    
    customizerModal.classList.add('open');
    customizerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCustomizer() {
    customizerModal.classList.remove('open');
    customizerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function goToStep(step) {
    customizer.currentStep = step;
    
    // UI de indicadores de paso
    stepDots.forEach(dot => {
      const dotStep = parseInt(dot.dataset.step, 10);
      dot.classList.remove('active', 'completed');
      if (dotStep === step) {
        dot.classList.add('active');
      } else if (dotStep < step) {
        dot.classList.add('completed');
      }
    });

    // Mostrar/ocultar paneles
    customizerSteps.forEach((panel, index) => {
      panel.classList.toggle('active', (index + 1) === step);
    });

    if (step === 2) {
      validateStep2();
    }
  }

  function selectDesign(type, designId) {
    if (type === 'front') {
      customizer.frontDesignId = designId;
      customizer.frontSimple = false;
      frontSimpleCheckbox.checked = false;
      
      $$('.design-card[data-type="front"]').forEach(c => {
        c.classList.toggle('selected', c.dataset.designId === designId);
      });
    } else {
      customizer.backDesignId = designId;
      customizer.backSimple = false;
      backSimpleCheckbox.checked = false;

      $$('.design-card[data-type="back"]').forEach(c => {
        c.classList.toggle('selected', c.dataset.designId === designId);
      });
    }
    validateStep2();
  }

  function validateStep2() {
    const hasFront = customizer.frontDesignId !== null || customizer.frontSimple;
    const hasBack = customizer.backDesignId !== null || customizer.backSimple;
    
    step2NextBtn.disabled = !(hasFront && hasBack);
  }

  /* ============================================
     DISEÑAR VISTA PREVIA (PASO 3)
     ============================================ */
  function generatePreview() {
    const basePrice = CUST_BASE_PRICES[customizer.type] || 20000;
    
    const frontDesign = FRONT_DESIGNS.find(d => d.id === customizer.frontDesignId);
    const backDesign = BACK_DESIGNS.find(d => d.id === customizer.backDesignId);
    
    const frontPrice = frontDesign ? frontDesign.price : 0;
    const backPrice = backDesign ? backDesign.price : 0;
    
    const totalPrice = basePrice + frontPrice + backPrice;
    
    previewName.textContent = `${customizer.type} Personalizado`;
    
    const summaryParts = [
      `Corte: ${customizer.cut}`,
      `Color: ${customizer.color}`,
      `Talle: ${customizer.size}`,
      `Frente: ${frontDesign ? frontDesign.name : 'Simple'}`,
      `Dorso: ${backDesign ? backDesign.name : 'Simple'}`
    ];
    previewSummary.textContent = summaryParts.join(' · ');
    previewPrice.textContent = formatPrice(totalPrice);

    // Color hex para el preview SVG
    let hexColor = '#1C1C1E'; // negro oxford default
    if (customizer.color === 'Blanco') hexColor = '#FFFFFF';
    if (customizer.color === 'Gris Oxford') hexColor = '#7F7F80';
    if (customizer.color === 'Beige') hexColor = '#E6D3B3';

    const frontChar = frontDesign ? frontDesign.previewChar : '';
    const backChar = backDesign ? backDesign.previewChar : '';

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 120" style="background:#e8e8e4;">
        <!-- Silueta de la prenda -->
        <path d="M20,30 L35,15 L50,22 L65,15 L80,30 L74,48 L68,46 L68,110 L32,110 L32,46 L26,48 Z" 
              fill="${hexColor}" stroke="#1c1c1e" stroke-width="2"/>
        
        <!-- Detalles según el tipo -->
        ${customizer.type === 'Canguro' ? `
          <!-- Capucha y bolsillo -->
          <path d="M35,15 Q50,3 65,15 Q50,22 35,15 Z" fill="${hexColor}" stroke="#1c1c1e" stroke-width="1.5"/>
          <path d="M40,85 L60,85 L64,100 L36,100 Z" fill="none" stroke="#1c1c1e" stroke-width="1.5"/>
        ` : ''}
        
        ${customizer.type === 'Manga Larga' ? `
          <!-- Costura cuello redondo -->
          <path d="M38,20 Q50,28 62,20" fill="none" stroke="#1c1c1e" stroke-width="1.5"/>
        ` : ''}

        ${customizer.type === 'Remera' ? `
          <!-- Corte de mangas cortas -->
          <line x1="28" y1="44" x2="32" y2="46" stroke="#1c1c1e" stroke-width="1.5"/>
          <line x1="72" y1="44" x2="68" y2="46" stroke="#1c1c1e" stroke-width="1.5"/>
        ` : ''}

        <!-- Diseño estampado frontal -->
        ${frontChar ? `
          <circle cx="50" cy="50" r="10" fill="#1c1c1e" opacity="0.15"/>
          <text x="50" y="54" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#d15b28" text-anchor="middle">${frontChar}</text>
        ` : ''}

        <!-- Diseño posterior miniatura en la manga/borde como indicativo -->
        ${backChar ? `
          <rect x="44" y="68" width="12" height="12" fill="#1c1c1e" opacity="0.15" rx="2"/>
          <text x="50" y="77" font-family="Arial,sans-serif" font-size="8" fill="#d15b28" text-anchor="middle">${backChar}</text>
        ` : ''}
      </svg>
    `;

    previewImgWrapper.innerHTML = svgIcon;
  }

  /* ============================================
     CONFIRMAR COMPRA PERSONALIZADA
     ============================================ */
  function confirmCustomizerPurchase() {
    const basePrice = CUST_BASE_PRICES[customizer.type] || 20000;
    
    const frontDesign = FRONT_DESIGNS.find(d => d.id === customizer.frontDesignId);
    const backDesign = BACK_DESIGNS.find(d => d.id === customizer.backDesignId);
    
    const frontPrice = frontDesign ? frontDesign.price : 0;
    const backPrice = backDesign ? backDesign.price : 0;
    
    const totalPrice = basePrice + frontPrice + backPrice;

    const customizedItem = {
      uid: generateUID(),
      productId: `custom-${Date.now()}`,
      name: `${customizer.type} Personalizado`,
      price: totalPrice,
      image: '',
      color: customizer.color,
      size: customizer.size,
      details: `${customizer.cut} · Frente: ${frontDesign ? frontDesign.name : 'Simple'} · Dorso: ${backDesign ? backDesign.name : 'Simple'}`,
      qty: 1,
      isCustom: true
    };

    cart.push(customizedItem);
    
    updateCartUI();
    closeCustomizer();
    showToast(`${customizedItem.name} añadido al carrito`);
    openCart();
  }

  /* ============================================
     ELIMINAR DEL CARRITO
     ============================================ */
  function removeFromCart(uid) {
    cart = cart.filter((item) => item.uid !== uid);
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
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.classList.toggle('visible', totalItems > 0);

    if (cart.length === 0) {
      cartEmptyMsg.style.display = 'block';
      cartFooter.style.display = 'none';
      const existingItems = cartItemsEl.querySelectorAll('.cart-item');
      existingItems.forEach((el) => el.remove());
    } else {
      cartEmptyMsg.style.display = 'none';
      cartFooter.style.display = 'block';
      renderCartItems();
    }

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

    checkoutBtn.disabled = cart.length === 0;
  }

  /* ============================================
     RENDERIZAR ITEMS DEL CARRITO
     ============================================ */
  function renderCartItems() {
    const existingItems = cartItemsEl.querySelectorAll('.cart-item');
    existingItems.forEach((el) => el.remove());

    cart.forEach((item) => {
      let imgSrc = item.image;
      
      if (!imgSrc) {
        const initials = item.name.split(' ').map(w => w[0]).join('').substring(0, 2);
        imgSrc = `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="68" height="82" viewBox="0 0 68 82">
            <rect fill="#e8e8e4" width="68" height="82"/>
            <text x="34" y="44" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="#b0b0a8" text-anchor="middle" dominant-baseline="middle">${initials}</text>
          </svg>`
        )}`;
      }

      const detailsText = item.isCustom 
        ? `${item.color} · Talle ${item.size}<br><span style="font-size:11px;color:var(--clr-gray-400);">${item.details}</span>`
        : `${item.color} · Talle ${item.size}`;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-details">${detailsText}</span>
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

    mainHeader.classList.toggle('scrolled', scrollY > 50);

    const sections = ['home', 'catalogo', 'personalizar'];
    let currentSection = 'home';

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop - 120;
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
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
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
