document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("cat");
  const productId = params.get("name");

  let product;

  if (category === "furniture") {
    product = furnitureProducts.find(p => p.id === productId);
  } else if (category === "ceramics") {
    product = ceramicProducts.find(p => p.id === productId);
  } else if (category === "lighting") {
    product = lightingProducts.find(p => p.id === productId);
  }

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
    slide.innerHTML = `<img src="images/pieces/${category}/${product.id}/${img}" alt="${product.title}">`;
    slider.appendChild(slide);
  });

  // Slider kontrolleri
  document.getElementById("prev").addEventListener("click", () => {
    slider.scrollBy({ left: -slider.offsetWidth / 2, behavior: "smooth" });
  });

  document.getElementById("next").addEventListener("click", () => {
    slider.scrollBy({ left: slider.offsetWidth / 2, behavior: "smooth" });
  });
});
