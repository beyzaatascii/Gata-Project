const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");
const project = projects.find(p => p.folder === slug);

if (project) {
  document.getElementById("projectTitle").textContent = project.title;

  const collectionText = project.collection ? `FOR ${project.collection.toUpperCase()}` : "";
  document.getElementById("projectCollection").textContent = collectionText;

  document.getElementById("projectYear").textContent = project.year;
  document.getElementById("projectInfo").textContent = project.info;

  let currentIndex = 0;
  const sliderImage = document.getElementById("sliderImage");
  const basePath = `images/projects/${project.folder}/`;

  // 🔥 preload yap → geç yükleme azalır
  project.slides.forEach(name => {
    const img = new Image();
    img.src = basePath + name;
  });

  const updateSlider = () => {
    sliderImage.src = basePath + project.slides[currentIndex];
  };

  updateSlider();

  window.changeSlide = function (direction) {
    const len = project.slides.length; // ✅ images değil slides
    currentIndex = (currentIndex + direction + len) % len;
    updateSlider();
  };

  window.toggleInfo = function () {
    document.getElementById("infoModal").classList.toggle("show");
  };

} else {
  document.body.innerHTML = "<p style='text-align:center;'>Proje bulunamadı.</p>";
}
