// HELPERS

// Hide BOTH hero & categories (search, dropdown)
function hideHeroAndCategories() {
  const hero = document.getElementById("heroSection");
  const categories = document.getElementById("categoriesSection");
  if (hero) hero.style.display = "none";
  if (categories) categories.style.display = "none";
}

// Hide ONLY hero (category cards)
function hideHeroOnly() {
  const hero = document.getElementById("heroSection");
  if (hero) hero.style.display = "none";
}

// Update cart count safely
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartCount) cartCount.innerText = cart.length;
}

// MAIN

document.addEventListener("DOMContentLoaded", () => {
  // ---------- BOOKS ----------
  const books = document.querySelectorAll(".book-card");

  // ---------- CATEGORY DROPDOWN ----------
  document.querySelectorAll(".dropdown-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      hideHeroAndCategories();

      const selected = link.dataset.category;

      books.forEach((book) => {
        const match = selected === "all" || book.dataset.category === selected;
        book.style.display = match ? "flex" : "none";
      });
    });
  });

  // ---------- CATEGORY CARDS (IMPORTANT FIX HERE) ----------
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      // only hide HERO, not categories
      hideHeroOnly();

      const selected = card.dataset.category;

      books.forEach((book) => {
        const match = selected === "all" || book.dataset.category === selected;
        book.style.display = match ? "flex" : "none";
      });
    });
  });

  // ---------- SEARCH ----------
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const suggestionsBox = document.getElementById("suggestions");

  if (searchInput && searchBtn && suggestionsBox) {
    const titles = Array.from(books).map(
      (book) => book.querySelector("h3").innerText
    );

    function filterBooks(text) {
      books.forEach((book) => {
        const title = book.querySelector("h3").innerText.toLowerCase();
        book.style.display = title.includes(text) ? "flex" : "none";
      });
    }

    // Typing → suggestions
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      suggestionsBox.innerHTML = "";

      if (!query) {
        suggestionsBox.style.display = "none";
        return;
      }

      titles
        .filter((title) => title.toLowerCase().includes(query))
        .forEach((title) => {
          const li = document.createElement("li");
          li.textContent = title;
          li.addEventListener("click", () => {
            searchInput.value = title;
            suggestionsBox.style.display = "none";
            hideHeroAndCategories();
            filterBooks(title.toLowerCase());
          });
          suggestionsBox.appendChild(li);
        });

      suggestionsBox.style.display = "block";
    });

    // Search button
    searchBtn.addEventListener("click", () => {
      hideHeroAndCategories();
      filterBooks(searchInput.value.toLowerCase());
    });

    // Click outside → hide suggestions
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) {
        suggestionsBox.style.display = "none";
      }
    });
  }

  // ---------- HOME LINK ----------
  const homeLink = document.querySelector("a[href='#heroSection']");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();

      const hero = document.getElementById("heroSection");
      const categories = document.getElementById("categoriesSection");

      if (hero) hero.style.display = "block";
      if (categories) categories.style.display = "block";

      // Show all books again
      books.forEach((book) => (book.style.display = "flex"));
    });
  }

  // ---------- ADD TO CART ----------
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.push({
        title: btn.dataset.title,
        price: Number(btn.dataset.price),
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      btn.innerText = "Added ✓";
      setTimeout(() => (btn.innerText = "Add to Cart"), 800);
    });
  });
});

//CART PAGE

const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");

if (cartItemsContainer && cartTotal && clearCartBtn) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCheckoutState(cart) {
    if (!checkoutBtn) return;
    checkoutBtn.disabled = cart.length === 0;
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.innerText = "0";
      updateCheckoutState(cart);
      return;
    }

    cart.forEach((item, index) => {
      total += item.price;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <h4>${item.title}</h4>
        <span>₹${item.price}</span>
        <button>Remove</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
      });

      cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = total;
    updateCheckoutState(cart);
  }

  clearCartBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    updateCartCount();
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      window.location.href = "checkout.html";
    });
  }

  renderCart();
}

// ---------- Animateion ----------
document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  scrollElements.forEach((el) => observer.observe(el));
});

// ---------- ContactForm ----------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const errors = form.querySelectorAll(".error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Clear errors
    errors.forEach((err) => (err.innerText = ""));

    // Name validation
    if (nameInput.value.trim() === "") {
      errors[0].innerText = "Name is required";
      valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      errors[1].innerText = "Enter a valid email";
      valid = false;
    }

    // Message validation
    if (messageInput.value.trim().length < 10) {
      errors[2].innerText = "Message must be at least 10 characters";
      valid = false;
    }

    // Success
    if (valid) {
      alert("Message sent successfully!");
      form.reset();
    }
  });
});
// ---------- Footer Section ----------
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("footerEmail");
  const subscribeBtn = document.getElementById("footerSubscribeBtn");
  const msg = document.getElementById("footerMsg");

  if (!emailInput || !subscribeBtn || !msg) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  subscribeBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();

    msg.className = "footer-error";

    if (email === "") {
      msg.innerText = "Email is required";
      msg.classList.add("error");
      return;
    }

    if (!emailPattern.test(email)) {
      msg.innerText = "Enter a valid email address";
      msg.classList.add("error");
      return;
    }

    // Success (frontend only)
    msg.innerText = "Subscribed successfully!";
    msg.classList.add("success");

    emailInput.value = "";

    // Auto-hide success message
    setTimeout(() => {
      msg.innerText = "";
      msg.className = "footer-error";
    }, 2500);
  });
});
