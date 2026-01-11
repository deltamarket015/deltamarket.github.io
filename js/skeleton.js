document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".product-card");
    cards.forEach(c => c.classList.add("skeleton"));

    window.addEventListener("load", () => {
        cards.forEach(c => c.classList.remove("skeleton"));
    });
});
