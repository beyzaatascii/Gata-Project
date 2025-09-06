document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("name");

  const product = products.find(p => p.id === productId);

  if (!product) {
    document.body.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-description").textContent = product.description;

  const slider = document.querySelector(".image-slider");

  product.images.forEach((img) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    slide.innerHTML = `<img src="images/${product.id}/${img}" alt="${product.title}">`;
    slider.appendChild(slide);
  });

  let scrollAmount = 0;

  document.getElementById("prev").addEventListener("click", () => {
    slider.scrollBy({
      left: -slider.offsetWidth / 2,
      behavior: "smooth"
    });
  });

  document.getElementById("next").addEventListener("click", () => {
    slider.scrollBy({
      left: slider.offsetWidth / 2,
      behavior: "smooth"
    });
  });
});


// RESME TIKLANINCA TAM EKRAN GÖSTER
document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".slide")) {
    const fullImg = e.target.getAttribute("src");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    lightboxImg.src = fullImg;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden"; // Scroll'u engelle
  }
});

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("show");
  document.body.style.overflow = "auto";
}
