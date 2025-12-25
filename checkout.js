document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("checkout-items");
  const totalElement = document.getElementById("checkout-total");

  if (!itemsContainer || !totalElement) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalElement.innerText = "0";
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = "";

  cart.forEach((item) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <span>${item.title}</span>
      <span>₹${item.price}</span>
    `;

    itemsContainer.appendChild(div);
  });

  totalElement.innerText = total;
});
