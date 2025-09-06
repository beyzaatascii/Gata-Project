let slideIndex = 0;
let autoSlideTimeout;
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("sliderDots");

// Dinamik dot oluşturma
slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function showSlide(index = null) {
  if (index !== null) {
    slideIndex = index;
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

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

function startAutoSlide() {
  autoSlideTimeout = setTimeout(() => {
    showSlide();
  }, 4000);
}

function resetAutoSlide() {
  clearTimeout(autoSlideTimeout);
  startAutoSlide();
}

// Başlangıç
startAutoSlide();
