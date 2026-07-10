/* ==========================================================================
   app.js — shared behaviour across every page
   ========================================================================== */

document.documentElement.classList.add("js");

/* -------------------------- Loader -------------------------- */
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 350);
  }
});

/* -------------------------- Header scroll state -------------------------- */
const header = document.querySelector(".site-header");
const onScroll = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);

  const btt = document.querySelector(".back-to-top");
  if (btt) btt.classList.toggle("visible", window.scrollY > 500);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* -------------------------- Mobile nav -------------------------- */
const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");
if (burger && navLinks) {
  const closeNav = () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const willOpen = !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", willOpen);
    burger.setAttribute("aria-expanded", String(willOpen));
  });
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  // close on outside click
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !burger.contains(e.target)) {
      closeNav();
    }
  });
  // close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

/* -------------------------- Active nav link -------------------------- */
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.dataset.page === path) a.classList.add("active");
  });
})();

/* -------------------------- Dark mode -------------------------- */
const themeSwitch = document.querySelector(".theme-switch");
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};
(() => {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
})();
if (themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

/* -------------------------- Back to top -------------------------- */
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -------------------------- Scroll reveal -------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
function observeReveal(root = document) {
  root.querySelectorAll(".reveal, .reveal-scale").forEach((el) => revealObserver.observe(el));
}
observeReveal();

/* -------------------------- Toasts -------------------------- */
function ensureToastStack() {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  return stack;
}
function showToast(message, type = "success") {
  const stack = ensureToastStack();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="dot"></span><span>${message}</span>`;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(24px)";
    toast.style.transition = "all .35s ease";
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}
window.showToast = showToast;

/* -------------------------- Ripple effect on .btn -------------------------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* -------------------------- Custom cursor (desktop only) -------------------------- */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let ringX = 0,
    ringY = 0,
    mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .product-card, input, textarea")) {
      ring.style.width = "44px";
      ring.style.height = "44px";
      ring.style.borderColor = "var(--c-primary)";
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, .product-card, input, textarea")) {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "var(--c-accent)";
    }
  });
}

/* -------------------------- Light parallax on hero blobs -------------------------- */
(() => {
  const blobs = document.querySelectorAll(".blob");
  if (!blobs.length) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      blobs.forEach((blob, i) => {
        blob.style.transform = `translateY(${y * (0.05 + i * 0.03)}px)`;
      });
    },
    { passive: true }
  );
})();

/* -------------------------- Star rating helper -------------------------- */
function renderStars(rating) {
  const full = Math.round(rating);
  let html = "";
  for (let i = 0; i < 5; i++) {
    html += i < full ? "★" : "☆";
  }
  return html;
}
window.renderStars = renderStars;

/* -------------------------- Product card markup builder -------------------------- */
function productCardHTML(p, index = 0) {
  const badgeClass = p.badge === "Best Seller" ? "badge best" : "badge";
  const oldPrice = p.oldPrice ? `<span class="price-old">${p.oldPrice.toFixed(2)}€</span>` : "";
  const wished = isInWishlist(p.id) ? "active" : "";
  return `
  <article class="product-card reveal ${p.badge ? "has-badge" : ""}" style="--delay:${(index % 3) * 0.08}s" data-id="${p.id}" data-category="${p.category}" data-name="${p.name.toLowerCase()}" data-price="${p.price}" data-popularity="${p.reviews}">
    <div class="thumb">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-icon">${p.icon}</div>
      ${p.badge ? `<span class="${badgeClass}">${p.badge}</span>` : ""}
      <button class="wish-btn ${wished}" data-wish="${p.id}" aria-label="Ajouter à la wishlist">
        <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z"/></svg>
      </button>
    </div>
    <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
    <p class="desc">${p.description}</p>
    <div class="price-row">
      <span class="price">${p.price.toFixed(2)}€</span>
      ${oldPrice}
    </div>
    <div class="card-actions">
      <a href="product.html?id=${p.id}" class="btn btn-ghost btn-sm">Voir</a>
      <button class="btn btn-primary btn-sm" data-add-cart="${p.id}">Acheter</button>
    </div>
  </article>`;
}
window.productCardHTML = productCardHTML;

/* -------------------------- Wishlist (localStorage) -------------------------- */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
    return [];
  }
}
function isInWishlist(id) {
  return getWishlist().includes(id);
}
function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter((i) => i !== id);
    showToast("Retiré de la wishlist", "success");
  } else {
    list.push(id);
    showToast("Ajouté à la wishlist ✨", "success");
  }
  localStorage.setItem("wishlist", JSON.stringify(list));
  return list.includes(id);
}
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;

document.addEventListener("click", (e) => {
  const wishBtn = e.target.closest("[data-wish]");
  if (!wishBtn) return;
  const active = toggleWishlist(wishBtn.dataset.wish);
  wishBtn.classList.toggle("active", active);
});

/* -------------------------- Contact form -------------------------- */
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = contactForm.querySelector(".form-status");
    const submitBtn = contactForm.querySelector("button[type='submit']");
    
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi...";

    // Ton URL de Webhook complète (le token y est déjà inclus)
    const webhookUrl = "https://discord.com/api/webhooks/1525169351240450238/8NxhjD6vOoCs-_FbEPwLLbt1FJfS2AXih4_c1wTVntWMX9cptfrf9H2mRG2Rt7Pnqr-g";

    const payload = {
      embeds: [{
        title: "📥 Nouveau message - Citro",
        color: 16764928,
        fields: [
          { name: "👤 Nom", value: document.getElementById('name').value, inline: true },
          { name: "✉️ Email", value: document.getElementById('email').value, inline: true },
          { name: "📌 Sujet", value: document.getElementById('subject').value },
          { name: "💬 Message", value: document.getElementById('message').value }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Envoyer le message";
      contactForm.reset();
      
      if (status) status.textContent = "Message envoyé ! Redirection vers Discord...";
      showToast("Message envoyé ✓", "success");

      // Redirection immédiate de l'utilisateur vers Discord
      setTimeout(() => {
        window.location.href = "https://discord.gg/6PSvwyycYh"; // Remplace par ton lien d'invitation Discord direct si besoin
      }, 800);
    })
    .catch((err) => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Envoyer le message";
      if (status) status.textContent = "Une erreur est survenue lors de l'envoi.";
      showToast("Erreur d'envoi ❌", "error");
      console.error(err);
    });
  });
}

/* -------------------------- FAQ accordion -------------------------- */
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const panel = item.querySelector(".accordion-panel");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".accordion-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector(".accordion-panel").style.maxHeight = null;
      }
    });

    item.classList.toggle("open", !isOpen);
    panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : null;
  });
});
