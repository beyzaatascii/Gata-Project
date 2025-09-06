let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("sliderDots");
let autoSlideTimeout; // zamanlayıcıyı tutmak için

// Dotları oluştur
slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function showSlide(nextIndex = null) {
  // Eğer parametre varsa (tıklama ile) onu kullan
  if (nextIndex !== null) {
    slideIndex = nextIndex;
  } else {
    slideIndex = (slideIndex + 1) % slides.length;
  }

  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
  });

  slides[slideIndex].classList.add("active");
  dots[slideIndex].classList.add("active");

  resetAutoSlide();
}

function goToSlide(index) {
  showSlide(index);
}

// Otomatik kaydırmayı başlat
function startAutoSlide() {
  autoSlideTimeout = setTimeout(() => {
    showSlide(); // sıradaki slayta geç
  }, 4000);
}

// Otomatik kaydırmayı sıfırla
function resetAutoSlide() {
  clearTimeout(autoSlideTimeout);
  startAutoSlide();
}

// Başlangıçta çalıştır
startAutoSlide();

// Menü toggle
function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  menu.classList.toggle('show');
}
