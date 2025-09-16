
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

      const updateSlider = () => {
        sliderImage.src = `images/projects/${project.folder}/${project.slides[currentIndex]}`;
      };

      updateSlider();

      window.changeSlide = function (direction) {
        currentIndex = (currentIndex + direction + project.images.length) % project.images.length;
        updateSlider();
      }

      window.toggleInfo = function () {
        document.getElementById("infoModal").classList.toggle("show");
      }

    } else {
      document.body.innerHTML = "<p style='text-align:center;'>Proje bulunamadı.</p>";
    }
