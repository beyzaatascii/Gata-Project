let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlide() {
  slides.forEach((slide, index) => {
    slide.classList.remove("active");
  });

  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}

setInterval(showSlide, 4000); // 4 saniyede bir geçiş


function toggleMenu() {
      const menu = document.getElementById('dropdownMenu');
      menu.classList.toggle('show');
    }