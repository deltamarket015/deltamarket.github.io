document.addEventListener("DOMContentLoaded", () => {
    if (!("IntersectionObserver" in window)) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("img-loaded");
                obs.unobserve(e.target);
            }
        });
    }, { rootMargin: "200px" });

    document.querySelectorAll("img[loading='lazy']").forEach(img => obs.observe(img));
});
