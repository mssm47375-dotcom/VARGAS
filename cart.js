/* ==========================================================================
   cart.js — cart state, drawer UI, totals
   Persisted to localStorage under "cart" as [{id, qty}]
   ========================================================================== */

const CART_KEY = "cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  const product = typeof getProductById === "function" ? getProductById(id) : null;
  showToast(`${product ? product.name : "Produit"} ajouté au panier`, "success");
  renderCartDrawer();
}

function removeFromCart(id) {
  saveCart(getCart().filter((i) => i.id !== id));
  renderCartDrawer();
  showToast("Produit retiré du panier", "success");
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    return removeFromCart(id);
  }
  saveCart(cart);
  renderCartDrawer();
}

function cartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = typeof getProductById === "function" ? getProductById(item.id) : null;
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function cartItemCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = cartItemCount();
  });
}

/* -------------------------- Cart drawer -------------------------- */
function ensureCartDrawer() {
  if (document.querySelector(".cart-drawer")) return;

  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";

  const drawer = document.createElement("aside");
  drawer.className = "cart-drawer";
  drawer.innerHTML = `
    <div class="cart-header">
      <h3>Votre panier</h3>
      <button class="icon-btn" id="cart-close" aria-label="Fermer le panier">✕</button>
    </div>
    <div class="cart-items"></div>
    <div class="cart-footer">
      <div class="cart-row"><span>Sous-total</span><span class="cart-subtotal">0.00€</span></div>
      <div class="cart-row"><span>Livraison</span><span>Gratuite</span></div>
      <div class="cart-row total"><span>Total</span><span class="cart-total">0.00€</span></div>
      <button class="btn btn-primary btn-block" id="cart-checkout">Acheter maintenant</button>
    </div>
  `;

  document.body.append(overlay, drawer);

  overlay.addEventListener("click", closeCartDrawer);
  drawer.querySelector("#cart-close").addEventListener("click", closeCartDrawer);
  drawer.querySelector("#cart-checkout").addEventListener("click", () => {
    if (cartItemCount() === 0) {
      showToast("Votre panier est vide", "error");
      return;
    }
    showToast("Commande envoyée ✓", "success");
    window.location.href = typeof ORDER_LINK !== "undefined" ? ORDER_LINK : "contact.html";
  });
}

function closeCartDrawer() {
  const drawer = document.querySelector(".cart-drawer");
  const overlay = document.querySelector(".cart-overlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
}

function openCartDrawer() {
  ensureCartDrawer();
  renderCartDrawer();
  document.querySelector(".cart-drawer").classList.add("open");
  document.querySelector(".cart-overlay").classList.add("open");
}

// Close the drawer with the Escape key, wherever the user is on the page
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCartDrawer();
});

function renderCartDrawer() {
  const drawer = document.querySelector(".cart-drawer");
  if (!drawer) return;
  const itemsWrap = drawer.querySelector(".cart-items");
  const cart = getCart();

  if (cart.length === 0) {
    itemsWrap.innerHTML = `<p class="empty-state">Votre panier est vide.</p>`;
  } else {
    itemsWrap.innerHTML = cart
      .map((item) => {
        const p = typeof getProductById === "function" ? getProductById(item.id) : null;
        if (!p) return "";
        return `
        <div class="cart-item">
          <div class="thumb"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
          <div class="info">
            <h4>${p.name}</h4>
            <div class="qty-stepper">
              <button data-qty-minus="${p.id}">−</button>
              <span>${item.qty}</span>
              <button data-qty-plus="${p.id}">+</button>
            </div>
            <button class="cart-remove" data-remove="${p.id}">Supprimer</button>
          </div>
          <strong>${(p.price * item.qty).toFixed(2)}€</strong>
        </div>`;
      })
      .join("");
  }

  const total = cartTotal();
  drawer.querySelector(".cart-subtotal").textContent = `${total.toFixed(2)}€`;
  drawer.querySelector(".cart-total").textContent = `${total.toFixed(2)}€`;
}

/* -------------------------- Event delegation -------------------------- */
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add-cart]");
  if (addBtn) {
    addToCart(addBtn.dataset.addCart, 1);
    openCartDrawer();
    return;
  }

  const cartTrigger = e.target.closest("[data-cart-open]");
  if (cartTrigger) {
    e.preventDefault();
    openCartDrawer();
    return;
  }

  const minus = e.target.closest("[data-qty-minus]");
  if (minus) return updateQty(minus.dataset.qtyMinus, -1);

  const plus = e.target.closest("[data-qty-plus]");
  if (plus) return updateQty(plus.dataset.qtyPlus, 1);

  const remove = e.target.closest("[data-remove]");
  if (remove) return removeFromCart(remove.dataset.remove);
});

document.addEventListener("DOMContentLoaded", () => {
  ensureCartDrawer();
  updateCartCount();
});