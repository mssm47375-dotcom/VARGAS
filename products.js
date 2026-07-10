/* ==========================================================================
   products.js
   Single source of truth for the catalog.
   Add / remove / edit products by editing the PRODUCTS array only —
   every page (shop, product, home "featured") reads from here.
   ========================================================================== */

const PRODUCTS = [
  {
    id: "nitro-basic",
    name: "Discord Nitro",
    category: "nitro",
    description: "Nitro Basic et Nitro, livraison rapide.",
    fullDescription:
      "Profitez de Discord Nitro avec des emojis animés partout, un partage d'écran en 4K, des uploads plus lourds et un boost de serveur offert chaque mois. Livraison rapide directement sur votre compte.",
    price: 7.99,
    oldPrice: 9.99,
    image: "assets/img/nitro.svg",
    icon: "⚡",
    badge: "Best Seller",
    stock: 24,
    rating: 4.9,
    reviews: 312
  },
  {
    id: "avatar-decorations",
    name: "Avatar Decorations",
    category: "custom",
    description: "Décorations de profil Discord.",
    fullDescription:
      "Personnalisez votre avatar avec des décorations exclusives et animées. Un moyen simple et instantané de démarquer votre profil sur tous vos serveurs.",
    price: 3.49,
    oldPrice: null,
    image: "assets/img/decorations.svg",
    icon: "✨",
    badge: "Popular",
    stock: 40,
    rating: 4.7,
    reviews: 158
  },
  {
    id: "server-boost",
    name: "Server Boosts",
    category: "boost",
    description: "Boosts pour serveurs Discord.",
    fullDescription:
      "Boostez votre serveur pour débloquer une meilleure qualité audio, plus d'emojis personnalisés, des bannières et un badge visible pour toute la communauté.",
    price: 5.99,
    oldPrice: 7.49,
    image: "assets/img/boost.svg",
    icon: "🚀",
    badge: "Popular",
    stock: 60,
    rating: 4.8,
    reviews: 204
  },
  {
    id: "premium-account",
    name: "Premium Accounts",
    category: "accounts",
    description: "Comptes premium vérifiés.",
    fullDescription:
      "Comptes premium créés et vérifiés avec soin, prêts à l'emploi. Idéal pour démarrer rapidement avec un profil propre et fiable.",
    price: 12.99,
    oldPrice: null,
    image: "assets/img/accounts.svg",
    icon: "🔐",
    badge: "Best Seller",
    stock: 15,
    rating: 4.6,
    reviews: 97
  },
  {
    id: "profile-setup",
    name: "Basic Profile Setup",
    category: "custom",
    description: "Création complète de profil Discord.",
    fullDescription:
      "Un profil Discord entièrement configuré pour vous : bannière, avatar, à propos et connexions, pensé pour donner une première impression premium.",
    price: 9.99,
    oldPrice: null,
    image: "assets/img/profile.svg",
    icon: "🏆",
    badge: "Popular",
    stock: 30,
    rating: 4.9,
    reviews: 76
  },
  {
    id: "custom-order",
    name: "Custom Order",
    category: "custom",
    description: "Commande personnalisée.",
    fullDescription:
      "Une envie précise ? Décrivez-nous votre besoin et nous préparons une offre sur mesure, adaptée à votre budget et à votre délai.",
    price: 4.99,
    oldPrice: null,
    image: "assets/img/custom.svg",
    icon: "💎",
    badge: null,
    stock: 99,
    rating: 5.0,
    reviews: 41
  }
];

/* Categories used by the shop filter bar */
const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "nitro", label: "Nitro" },
  { id: "boost", label: "Boost" },
  { id: "accounts", label: "Accounts" },
  { id: "custom", label: "Custom" }
];

/* Configurable link used by every "Commander / Acheter maintenant" action.
   Point this at a Discord server invite, a contact form, or a checkout URL
   once payments are wired up. */
const ORDER_LINK = "contact.html";

/* Helper: find a product by id */
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

/* Helper: related products (same category, excluding current) */
function getRelatedProducts(product, limit = 3) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, limit);
}