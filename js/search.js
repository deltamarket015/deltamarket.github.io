document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("productSearch");
    const items = document.querySelectorAll(".product-link");
    const empty = document.getElementById("noProduct");
    let timer;

    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            let count = 0;
            const val = input.value.toLowerCase();

            items.forEach(item => {
                const title = item.querySelector(".product-title");
                const text = title.textContent;
                title.textContent = text;

                if (!val || text.toLowerCase().includes(val)) {
                    item.style.display = "block";
                    item.classList.remove("hide");
                    count++;

                    if (val) {
                        title.innerHTML = text.replace(
                            new RegExp(`(${val})`, "ig"),
                            "<mark>$1</mark>"
                        );
                    }
                } else {
                    item.classList.add("hide");
                    setTimeout(() => item.style.display = "none", 300);
                }
            });

            empty.style.display = count ? "none" : "block";
        }, 120);
    });
});
