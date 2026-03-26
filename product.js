document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const category = params.get("cat") || "";
  const productId = params.get("name") || "";

  // Dataset seç
  const DATASETS = {
    furniture: window.furnitureProducts || [],
    ceramics:  window.ceramicProducts  || [],
    lighting:  window.lightingProducts || [],
  };
  const list = DATASETS[category] || [];

  // Ürünü bul
  const product = list.find(p => p.id === productId);
  if (!product) {
    document.body.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  // Başlık & açıklama
  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-description").textContent = product.description;
  document.title = `${product.title} | GATA DESIGN`;

  // --- SLIDER ---
  const slider = document.querySelector(".image-slider");
  slider.innerHTML = "";
  (product.images || []).forEach((img) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `<img src="images/pieces/${category}/${product.id}/${img}" alt="${product.title}">`;
    slider.appendChild(slide);
  });

  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  prev?.addEventListener("click", () => {
    slider.scrollBy({ left: -slider.offsetWidth / 2, behavior: "smooth" });
  });
  next?.addEventListener("click", () => {
    slider.scrollBy({ left:  slider.offsetWidth / 2, behavior: "smooth" });
  });

  // Görsele tıklayınca lightbox (sadece slider dinlenir)
  slider.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    lbImg.src = img.src;
    lb.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  // --- DETAY (meta) -> MODAL ---
  const metaSection = document.querySelector(".product-meta-section"); // pill burada
  const pill        = document.querySelector(".pill-title");

  const modal     = document.getElementById("meta-modal");
  const modalRows = document.getElementById("meta-modal-rows");

  // Meta satırlarını hazırla
  const FIELD_MAP = [
    ["Ölçüler",     "olculer"],
    ["Malzemeler",  "malzeme"],
  ];

  let rows = "";
  if (product.meta && typeof product.meta === "object") {
    rows = FIELD_MAP
      .map(([label, key]) => product.meta[key]
        ? `<tr><th>${label}:</th><td>${product.meta[key]}</td></tr>`
        : "")
      .join("");
  }

  if (rows) {
    // pill görünsün
    metaSection?.classList.remove("is-hidden");
    // modal satırlarını yükle
    modalRows.innerHTML = rows;

    const openModal = () => {
      modal.hidden = false;
      modal.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
      modal.setAttribute("aria-hidden","true");
      modal.hidden = true;
      document.body.style.overflow = "";
    };

    pill?.addEventListener("click", openModal);
    modal.addEventListener("click", (e) => {
      if (e.target.matches(".mm-backdrop, .mm-close")) closeModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  } else {
    // meta yoksa tamamen gizle
    metaSection?.classList.add("is-hidden");
  }
});

// Lightbox kapat
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("show");
  document.body.style.overflow = "auto";
}
