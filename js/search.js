document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("productSearch");
    const items = document.querySelectorAll(".product-link");
    const empty = document.getElementById("noProduct");
    const grid = document.querySelector(".products-grid");

    if (!input || !grid) return;

    /* =========================
       STORE ORIGINAL TITLES
    ========================= */
    items.forEach(item => {
        const title = item.querySelector(".product-title");
        if (!title.dataset.original) {
            title.dataset.original = title.textContent.trim();
        }
    });

    /* =========================
       RESET EVERYTHING
    ========================= */
    const resetAll = () => {
        items.forEach(item => {
            const title = item.querySelector(".product-title");
            title.innerHTML = title.dataset.original;
            item.classList.remove("hide");
        });

        grid.classList.remove("searching");
        if (empty) empty.style.display = "none";
    };

    /* =========================
       SEARCH LOGIC
    ========================= */
    const runSearch = () => {
        const value = input.value.toLowerCase().trim();
        let visibleCount = 0;

        /* EMPTY INPUT → FULL RESET */
        if (value === "") {
            resetAll();
            return;
        }

        grid.classList.add("searching");

        items.forEach(item => {
            const title = item.querySelector(".product-title");
            const original = title.dataset.original;
            const lower = original.toLowerCase();

            if (lower.includes(value)) {
                item.classList.remove("hide");
                visibleCount++;

                title.innerHTML = original.replace(
                    new RegExp(`(${value})`, "ig"),
                    "<mark>$1</mark>"
                );
            } else {
                item.classList.add("hide");
            }
        });

        if (empty) {
            empty.style.display = visibleCount === 0 ? "block" : "none";
        }
    };

    /* =========================
       INPUT EVENT (AUTO)
    ========================= */
    input.addEventListener("input", runSearch);

    /* =========================
       ENTER KEY (SAFE)
    ========================= */
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            runSearch();
        }
    });

    /* =========================
       ESC KEY (CLEAR)
    ========================= */
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            input.value = "";
            resetAll();
        }
    });

    /* =========================
       PAGE LOAD SAFETY
    ========================= */
    input.value = "";
    resetAll();

    window.addEventListener("pageshow", () => {
        input.value = "";
        resetAll();
    });
});