//Change Theme
const themeToggle = document.querySelector(".themeInp");

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light_theme_var');
})