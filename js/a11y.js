document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        const s = document.getElementById("productSearch");
        if (s) s.value = "";
    }
});
