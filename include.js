window.addEventListener("DOMContentLoaded", () => {
    // Navbar'ı yükle
    fetch("navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

    // Footer'ı yükle
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});

function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    menu.classList.toggle("show");
}
