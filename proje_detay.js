// projects: [{ folder, title, year, location, category, designer, status, slides: [...] }]

(function () {
  // --- Projeyi bul ---
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug") || "";

  // window.projects ya da global "projects" (const/let) her iki yolu da destekle
  const PROJECTS =
    (typeof projects !== "undefined" ? projects : (window.projects || []));

  const project = PROJECTS.find(p => p.folder === slug);

  if (!project) {
    document.body.innerHTML = "<p style='text-align:center;'>Proje bulunamadı.</p>";
    return;
  }

  // --- Metin alanları ---
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v ?? ""; };
  setTxt("projectTitle", project.title);
  setTxt("projectYear",  project.year);
  setTxt("location",     project.location);
  setTxt("category",     project.category);
  setTxt("designer",     project.designer);
  setTxt("status",       project.status);
  document.title = `${project.title} | GATA DESIGN`;

  // --- Slider (sonsuz & hizalı) ---
  const track = document.getElementById("sliderTrack");
  const btnPrev = document.getElementById("prevBtn");
  const btnNext = document.getElementById("nextBtn");

  if (!track) return;

  track.innerHTML = "";

  const slides = Array.isArray(project.slides) ? [...project.slides] : [];
  if (!slides.length) return;

  // baş/sona klon ekle
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  extendedSlides.forEach(img => {
    const div = document.createElement("div");
    div.className = "slide";
    // `loading="eager"` korundu.
    div.innerHTML = `<img src="images/projects/${project.folder}/${img}" alt="${project.title}" loading="eager">`; 
    track.appendChild(div);
  });

  let index = 1;      // ilk gerçek kare
  let stepPx = 0;     // tek adım: kart genişliği + gap
  let isAnimating = false;

  function calcStep() {
    const first = track.querySelector(".slide");
    if (!first) return 0;
    
    // CSS'ten okuma: CSS'teki 'gap: 10px;' kuralını otomatik okuyoruz.
    const gap = parseFloat(getComputedStyle(track).gap || "0") || 0; 
    
    const w = first.getBoundingClientRect().width;
    
    if (w === 0 || gap === 0) {
        console.warn("[CalcStep Hata] Genişlik veya boşluk sıfır. Hesaplama başarısız olabilir.");
    }
    
    // Hata Ayıklama (Debug)
    console.log(`[calcStep] Slide Width (70%): ${w.toFixed(2)}px, Gap: ${gap}px, Step: ${(w + gap).toFixed(2)}px`);
    
    return w + gap; // Kart Genişliği + Gerçek CSS Boşluğu
  }

  function setTranslate(animated) {
    track.style.transition = animated ? "transform 0.5s ease" : "none";
    track.style.transform  = `translateX(${-index * stepPx}px)`;
  }

  function recalcAndSnap() {
    stepPx = calcStep();
    setTranslate(false); // anında doğru konuma al
  }

  // 🔥 YENİ ÇÖZÜM: İlk hesaplamayı pencere ve tüm resimler yüklendikten sonra (load)
  // + 50ms daha bekleterek tarayıcı layout'unun oturmasını sağlıyoruz.
  // Bu, GitHub Pages'teki zamanlama sorununu çözer.
  window.addEventListener('load', () => {
    // 50ms gecikme, tarayıcının son layout hesaplamasını tamamlaması için kritik
    setTimeout(() => {
        index = 1;
        recalcAndSnap();
        console.log(`[Init] Başlangıç stepPx değeri: ${stepPx.toFixed(2)} (Stabilizasyon sonrası hesaplandı)`);
    }, 50); 
  });

  // responsive
  window.addEventListener("resize", recalcAndSnap);

  function move(dir) {
    if (isAnimating || !stepPx) {
        if (!stepPx) console.warn("[Move] StepPx sıfır. Hesaplama yapılmadı.");
        return;
    }
    isAnimating = true;
    index += (dir === "next" ? 1 : -1);
    setTranslate(true);
    // Konsola güncel index ve kayma miktarını basalım
    console.log(`[Move] Index: ${index}, Extended Length: ${extendedSlides.length}, Translate: ${(-index * stepPx).toFixed(2)}px`);
  }

  btnNext?.addEventListener("click", () => move("next"));
  btnPrev?.addEventListener("click", () => move("prev"));
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") move("next");
    if (e.key === "ArrowLeft")  move("prev");
  });

  // sonsuz döngü reset (animsız, çaktırmadan)
  track.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (index === extendedSlides.length - 1) { // en sondaki clone (index N+1)
      index = 1;                                // ilk gerçek (index 1)
      setTranslate(false);
      console.log(`[Loop] Reset: Index ${extendedSlides.length - 1} -> 1 (İleri Döngü)`);
    } else if (index === 0) {                   // en baştaki clone (index 0)
      index = extendedSlides.length - 2;        // son gerçek (index N)
      setTranslate(false);
      console.log(`[Loop] Reset: Index 0 -> ${extendedSlides.length - 2} (Geri Döngü)`);
    }
    isAnimating = false;
  });

  // --- Lightbox ---
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const closeLB       = document.getElementById("closeLightbox");
  const prevLB        = document.getElementById("prevLightbox");
  const nextLB        = document.getElementById("nextLightbox");

  let currentLightboxIndex = 0;

  function openLightbox(src, origIndex) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
    currentLightboxIndex = origIndex;
  }
  function showLB(i) {
    currentLightboxIndex = (i + slides.length) % slides.length;
    if (lightboxImg)
      lightboxImg.src = `images/projects/${project.folder}/${slides[currentLightboxIndex]}`;
  }

  // sadece track üzerinde dinle
  track.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    const ix = slides.findIndex(s => img.src.includes(s)); // orijinal index
    if (ix > -1) openLightbox(img.src, ix);
  });

  closeLB?.addEventListener("click", () => {
    lightbox?.classList.remove("show");
    document.body.style.overflow = "auto";
  });
  prevLB?.addEventListener("click", () => showLB(currentLightboxIndex - 1));
  nextLB?.addEventListener("click", () => showLB(currentLightboxIndex + 1));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox?.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  });

  // --- (Varsa) bilgi modal toggle ---
  window.toggleInfo = function () {
    document.getElementById("infoModal")?.classList.toggle("show");
  };
})();