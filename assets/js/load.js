//Loading animation
window.addEventListener("load", function () {
    let loadingScreen = document.getElementById("loading-screen");

    setTimeout(() => {
        loadingScreen.style.transition = "opacity 0.6s ease";
        loadingScreen.style.opacity = "0";
    }, 200);

    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 600);
});