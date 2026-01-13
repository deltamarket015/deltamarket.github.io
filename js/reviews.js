document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".reviews-track");
    if (!track) return;

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    const stopAnimation = () => {
        track.style.animationPlayState = "paused";
    };

    const startAnimation = () => {
        track.style.animationPlayState = "running";
        track.style.transform = "translateX(0)";
    };

    /* MOUSE */
    track.addEventListener("mousedown", e => {
        isDragging = true;
        startX = e.pageX;
        stopAnimation();
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        startAnimation();
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        currentX = (e.pageX - startX) * 1.1;
        track.style.transform = `translateX(${currentX}px)`;
    });

    /* TOUCH */
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].pageX;
        stopAnimation();
    }, { passive: true });

    track.addEventListener("touchmove", e => {
        currentX = (e.touches[0].pageX - startX) * 1.1;
        track.style.transform = `translateX(${currentX}px)`;
    }, { passive: true });

    track.addEventListener("touchend", startAnimation);
});
