/* =========================================================
   MUSIC ARTIST WEBSITE — MAIN APPLICATION SCRIPT
   ========================================================= */

'use strict';

/* ── State ─────────────────────────────────────────────────── */
const state = {
  cart: [],
  products: [],
  memberships: [],
  isPlaying: false,
  billingYearly: false,
  currentFilter: 'all',
  currentMembership: null,
  playProgress: 0,
  playTimer: null,
  totalDuration: 204 // 3:24 in seconds (demo)
};

/* ── DOM Refs ───────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── Cover Gradient Styles ──────────────────────────────────── */
const coverStyles = [
  { class: 'cover-bg-1', emoji: '🌙', initials: 'MS' },
  { class: 'cover-bg-2', emoji: '⚡', initials: 'EH' },
  { class: 'cover-bg-3', emoji: '☀️', initials: 'GH' },
  { class: 'cover-bg-4', emoji: '🎵', initials: 'RC' }
];

const membershipIcons = {
  'Fan': { icon: 'fa-star', color: '#6366f1' },
  'Superfan': { icon: 'fa-fire', color: '#f59e0b' },
  'Inner Circle': { icon: 'fa-crown', color: '#ec4899' }
};

/* ── Utility Functions ──────────────────────────────────────── */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function showToast(msg, icon = 'fa-circle-check') {
  const toast = $('toast');
  toast.innerHTML = `<i class="fas ${icon}" style="color:var(--accent-purple-light)"></i>${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── Particle Background ─────────────────────────────────────── */
function initParticles() {
  const container = $('particles');
  if (!container) return;
  const colors = ['#7c3aed', '#a855f7', '#f59e0b', '#ec4899', '#6366f1'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 20;
    const duration = Math.random() * 20 + 15;
    const left = Math.random() * 100;
    Object.assign(p.style, {
      width: `${size}px`,
      height: `${size}px`,
      background: color,
      left: `${left}%`,
      bottom: `-${size}px`,
      opacity: Math.random() * 0.6 + 0.2,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      filter: `blur(${Math.random() > 0.7 ? 1 : 0}px)`
    });
    container.appendChild(p);
  }
}

/* ── Navbar ─────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = $('navbar');
  const hamburger = $('hamburger');
  const navLinks = $('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

function updateActiveNavLink() {
  const sections = ['home', 'music', 'memberships', 'about', 'contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  $$('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ── Simulated Audio Player ──────────────────────────────────── */
function initPlayer() {
  const playBtn = $('playBtn');
  const playIcon = $('playIcon');
  const progressFill = $('progressFill');
  const currentTimeEl = $('currentTime');
  const totalTimeEl = $('totalTime');
  const progressBar = $('progressBar');
  const vinyl = $('vinyl');

  totalTimeEl.textContent = formatTime(state.totalDuration);

  playBtn.addEventListener('click', togglePlay);

  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    state.playProgress = ratio * state.totalDuration;
    updateProgress();
    if (!state.isPlaying) { state.isPlaying = true; startPlayTimer(); updatePlayUI(); }
  });

  function togglePlay() {
    state.isPlaying = !state.isPlaying;
    updatePlayUI();
    if (state.isPlaying) startPlayTimer(); else stopPlayTimer();
  }

  function updatePlayUI() {
    playIcon.className = state.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    if (vinyl) vinyl.classList.toggle('paused', !state.isPlaying);
  }

  function startPlayTimer() {
    stopPlayTimer();
    state.playTimer = setInterval(() => {
      state.playProgress += 0.5;
      if (state.playProgress >= state.totalDuration) {
        state.playProgress = 0;
        state.isPlaying = false;
        updatePlayUI();
        stopPlayTimer();
      }
      updateProgress();
    }, 500);
  }

  function stopPlayTimer() {
    if (state.playTimer) { clearInterval(state.playTimer); state.playTimer = null; }
  }

  function updateProgress() {
    const pct = (state.playProgress / state.totalDuration) * 100;
    progressFill.style.width = `${pct}%`;
    currentTimeEl.textContent = formatTime(state.playProgress);
  }

  // Volume slider
  const volSlider = $('volumeSlider');
  if (volSlider) {
    volSlider.addEventListener('input', e => {
      // In production this controls actual audio volume
      const vol = e.target.value;
      volSlider.style.background = `linear-gradient(to right, var(--accent-purple-light) ${vol}%, rgba(255,255,255,0.1) ${vol}%)`;
    });
    volSlider.dispatchEvent(new Event('input'));
  }
}

/* ── Product Card Builder ────────────────────────────────────── */
function buildProductCard(product, index) {
  const style = coverStyles[index % coverStyles.length];
  const badgeClass = `badge-${product.type}`;
  const typeLabel = product.type.charAt(0).toUpperCase() + product.type.slice(1);
  const inCart = state.cart.some(c => c.id === product.id);

  return `
    <div class="product-card" data-type="${product.type}" data-id="${product.id}">
      <div class="product-cover">
        <div class="product-cover-placeholder ${style.class}">
          <span class="cover-initials">${style.initials}</span>
          <span class="cover-subtitle">${product.genre}</span>
        </div>
        <div class="cover-overlay">
          <button class="play-overlay-btn" aria-label="Preview ${product.title}">
            <i class="fas fa-play"></i>
          </button>
        </div>
        <span class="product-badge ${badgeClass}">${typeLabel}</span>
        ${product.featured ? '<span class="product-badge" style="top:12px;left:auto;right:12px;background:rgba(16,185,129,0.85)">Featured</span>' : ''}
      </div>
      <div class="product-info">
        <div class="product-title">${product.title}</div>
        <div class="product-artist">${product.artist}</div>
        <div class="product-meta">
          ${product.track_count > 1 ? `<span><i class="fas fa-music"></i> ${product.track_count} tracks</span>` : '<span><i class="fas fa-music"></i> Single</span>'}
          <span><i class="fas fa-calendar"></i> ${product.release_year}</span>
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:16px;line-height:1.5;">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="add-to-cart-btn ${inCart ? 'added' : ''}" data-id="${product.id}" onclick="addToCart('${product.id}')">
            ${inCart ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-cart-plus"></i> Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ── Load Products ───────────────────────────────────────────── */
async function loadProducts() {
  const grid = $('productsGrid');
  try {
    const resp = await fetch('tables/music_products?limit=20');
    const data = await resp.json();
    state.products = data.data || [];
    renderProducts(state.products);
  } catch (err) {
    console.error('Error loading products:', err);
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Could not load products. Please try again.</p>';
  }
}

function renderProducts(products) {
  const grid = $('productsGrid');
  const filtered = state.currentFilter === 'all'
    ? products
    : products.filter(p => p.type === state.currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:40px;grid-column:1/-1;">No products found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => buildProductCard(p, i)).join('');

  // Play preview buttons
  grid.querySelectorAll('.play-overlay-btn').forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast(`Preview: "${filtered[i].title}" (Connect audio source to enable previews)`);
    });
  });
}

/* ── Filter Tabs ─────────────────────────────────────────────── */
function initFilterTabs() {
  $$('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.dataset.filter;
      renderProducts(state.products);
    });
  });
}

/* ── Cart ────────────────────────────────────────────────────── */
function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  if (state.cart.some(c => c.id === productId)) {
    showToast(`"${product.title}" is already in your cart`, 'fa-info-circle');
    return;
  }
  state.cart.push(product);
  updateCartUI();
  showToast(`Added "${product.title}" to cart 🎵`);
  renderProducts(state.products);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(c => c.id !== productId);
  updateCartUI();
  renderProducts(state.products);
}

function updateCartUI() {
  const badge = $('cartBadge');
  badge.textContent = state.cart.length;
  badge.style.display = state.cart.length === 0 ? 'none' : 'flex';

  const cartItemsEl = $('cartItems');
  const cartFooter = $('cartFooter');

  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-music"></i>
        <p>Your cart is empty</p>
        <a href="#music" class="btn btn-outline btn-sm" onclick="closeCart()">Browse Music</a>
      </div>`;
    cartFooter.style.display = 'none';
    return;
  }

  const styles = ['cover-bg-1', 'cover-bg-2', 'cover-bg-3', 'cover-bg-4'];
  cartItemsEl.innerHTML = state.cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-art">
        <div class="product-cover-placeholder ${styles[i % styles.length]}" style="width:52px;height:52px;border-radius:10px;font-size:1.2rem;">
          <span>${coverStyles[i % coverStyles.length].initials}</span>
        </div>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-type">${item.type}</div>
      </div>
      <span class="cart-item-price">$${item.price.toFixed(2)}</span>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove ${item.title}">
        <i class="fas fa-xmark"></i>
      </button>
    </div>
  `).join('');

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  $('cartTotal').textContent = `$${total.toFixed(2)}`;
  cartFooter.style.display = 'flex';
}

function openCart() {
  $('cartDrawer').classList.add('open');
  $('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('cartDrawer').classList.remove('open');
  $('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function initCart() {
  $('cartBtn').addEventListener('click', openCart);
  $('cartClose').addEventListener('click', closeCart);
  $('cartOverlay').addEventListener('click', closeCart);
  $('checkoutBtn').addEventListener('click', () => {
    showToast('Connect Stripe or PayPal to enable real checkout!', 'fa-credit-card');
  });
  // Hide badge initially
  $('cartBadge').style.display = 'none';
}

/* ── Memberships ─────────────────────────────────────────────── */
function buildMembershipCard(mem) {
  const meta = membershipIcons[mem.name] || { icon: 'fa-star', color: '#6366f1' };
  const price = state.billingYearly ? mem.price_yearly : mem.price_monthly;
  const period = state.billingYearly ? '/year' : '/month';
  const yearlySavings = ((mem.price_monthly * 12) - mem.price_yearly).toFixed(0);

  const features = Array.isArray(mem.features) ? mem.features : [];

  return `
    <div class="membership-card ${mem.is_popular ? 'popular' : ''}">
      ${mem.is_popular ? '<div class="popular-badge">⭐ Most Popular</div>' : ''}
      <div class="membership-icon" style="background:${meta.color}22;color:${meta.color}">
        <i class="fas ${meta.icon}"></i>
      </div>
      <div class="membership-name">${mem.name}</div>
      <div class="membership-desc">${mem.description}</div>
      <div class="membership-price">
        <div class="price-amount" style="color:${meta.color}">$${price}<span style="font-size:1rem;font-weight:500;color:var(--text-secondary)">${period}</span></div>
        ${state.billingYearly ? `<div class="price-yearly-note">💰 Save $${yearlySavings} vs monthly</div>` : '<div style="height:20px"></div>'}
      </div>
      <ul class="membership-features">
        ${features.map(f => `<li><i class="fas fa-circle-check"></i>${f}</li>`).join('')}
      </ul>
      <button class="btn btn-primary btn-full" style="background:linear-gradient(135deg,${meta.color},${meta.color}cc)" onclick="openMembershipModal('${mem.id}')">
        <i class="fas ${meta.icon}"></i> Get ${mem.name}
      </button>
    </div>
  `;
}

async function loadMemberships() {
  const grid = $('membershipGrid');
  try {
    const resp = await fetch('tables/memberships?limit=10');
    const data = await resp.json();
    state.memberships = data.data || [];
    renderMemberships();
  } catch (err) {
    console.error('Error loading memberships:', err);
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Could not load memberships.</p>';
  }
}

function renderMemberships() {
  const grid = $('membershipGrid');
  grid.innerHTML = state.memberships.map(buildMembershipCard).join('');
}

function initBillingToggle() {
  const toggle = $('billingToggle');
  const monthlyLabel = $('monthlyLabel');
  const yearlyLabel = $('yearlyLabel');

  toggle.addEventListener('change', () => {
    state.billingYearly = toggle.checked;
    monthlyLabel.classList.toggle('active', !toggle.checked);
    yearlyLabel.classList.toggle('active', toggle.checked);
    renderMemberships();
  });
}

/* ── Membership Modal ────────────────────────────────────────── */
function openMembershipModal(membershipId) {
  const mem = state.memberships.find(m => m.id === membershipId);
  if (!mem) return;
  state.currentMembership = mem;

  const meta = membershipIcons[mem.name] || { icon: 'fa-star', color: '#6366f1' };
  const price = state.billingYearly ? mem.price_yearly : mem.price_monthly;
  const period = state.billingYearly ? 'year' : 'month';

  $('modalIcon').innerHTML = `<i class="fas ${meta.icon}"></i>`;
  $('modalIcon').style.background = `${meta.color}22`;
  $('modalIcon').style.color = meta.color;
  $('modalTitle').textContent = `Join ${mem.name}`;
  $('modalPrice').textContent = `$${price}/${period}`;
  $('memBtnText').textContent = `Start ${mem.name} Membership`;

  // Reset form
  $('memberForm').style.display = 'flex';
  $('memSuccess').style.display = 'none';
  $('memName').value = '';
  $('memEmail').value = '';

  $('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMembershipModal() {
  $('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function initMembershipModal() {
  $('modalClose').addEventListener('click', closeMembershipModal);
  $('modalOverlay').addEventListener('click', e => {
    if (e.target === $('modalOverlay')) closeMembershipModal();
  });

  $('memberForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('memName').value.trim();
    const email = $('memEmail').value.trim();
    if (!name || !email) {
      showToast('Please fill in all fields', 'fa-triangle-exclamation');
      return;
    }

    const btn = $('memBtn');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
      await fetch('tables/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          membership_tier: state.currentMembership?.name || '',
          subscribed_at: new Date().toISOString()
        })
      });

      $('memberForm').style.display = 'none';
      $('memSuccess').style.display = 'block';
      $('memSuccessText').textContent = `Your interest in the ${state.currentMembership?.name} tier has been saved. We'll reach out shortly with next steps!`;
      showToast(`Welcome to the ${state.currentMembership?.name} family! 🎉`);
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'fa-triangle-exclamation');
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  });
}

/* ── Newsletter Form ─────────────────────────────────────────── */
function initNewsletterForm() {
  const form = $('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('subName').value.trim();
    const email = $('subEmail').value.trim();
    const tier = $('subTier').value;

    if (!name || !email) {
      showToast('Please enter your name and email', 'fa-triangle-exclamation');
      return;
    }

    const btn = $('subBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    btn.disabled = true;

    try {
      await fetch('tables/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          membership_tier: tier || 'newsletter',
          subscribed_at: new Date().toISOString()
        })
      });

      form.style.display = 'none';
      $('formSuccess').style.display = 'block';
      showToast('You\'re subscribed! 🎵');
    } catch (err) {
      showToast('Subscription failed. Please try again.', 'fa-triangle-exclamation');
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe & Connect';
      btn.disabled = false;
    }
  });
}

/* ── Intersection Observer — Animate on Scroll ───────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.product-card, .membership-card, .testimonial-card, .highlight').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* ── Global Expose ───────────────────────────────────────────── */
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openMembershipModal = openMembershipModal;
window.closeCart = closeCart;

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  initNavbar();
  initPlayer();
  initFilterTabs();
  initCart();
  initBillingToggle();
  initMembershipModal();
  initNewsletterForm();

  // Load data
  await Promise.all([loadProducts(), loadMemberships()]);

  // Animate existing cards
  setTimeout(initScrollAnimations, 100);

  // Keyboard accessibility
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      closeMembershipModal();
    }
  });
});
