const THEME_KEY = "visionary-theme";
  const themeToggle = document.getElementById("themeToggle");
  const THEME_ICON_BREAKPOINT = 560;
  const SUN_ICON = '<svg class="theme-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.8V5.2M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5 16.8 7.2M7.2 16.8 5.5 18.5M18.5 18.5 16.8 16.8M7.2 7.2 5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const MOON_ICON = '<svg class="theme-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.2A8.5 8.5 0 1 1 9.8 4c-.1.4-.1.8-.1 1.2a8.7 8.7 0 0 0 8.7 8.7c.5 0 1-.1 1.6-.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  function updateThemeToggleContent(isLight){
    const compactToggle = window.innerWidth <= THEME_ICON_BREAKPOINT;
    const nextLabel = isLight ? "Modo oscuro" : "Modo claro";
    const nextIcon = isLight ? MOON_ICON : SUN_ICON;
    if (compactToggle) {
      themeToggle.classList.add("compact");
      themeToggle.innerHTML = nextIcon;
      themeToggle.setAttribute("title", `Cambiar a ${nextLabel.toLowerCase()}`);
      return;
    }

    themeToggle.classList.remove("compact");
    themeToggle.innerHTML = `${nextIcon}<span class="theme-toggle-label">${nextLabel}</span>`;
    themeToggle.setAttribute("title", "");
  }

  function applyTheme(theme){
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    updateThemeToggleContent(isLight);
    themeToggle.setAttribute("aria-label", isLight ? "Activar modo oscuro" : "Activar modo claro");
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", ()=>{
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  window.addEventListener("resize", () => {
    const isLight = document.body.classList.contains("light-mode");
    updateThemeToggleContent(isLight);
  });

  // Mostrar solo una secciÃ³n
  const imageViewer = document.getElementById("imageViewer");
  const imageViewerImg = document.getElementById("imageViewerImg");

  function openImageViewer(src, altText){
    imageViewerImg.src = src;
    imageViewerImg.alt = altText || "Imagen del producto";
    imageViewer.classList.add("open");
    imageViewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeImageViewer(){
    imageViewer.classList.remove("open");
    imageViewer.setAttribute("aria-hidden", "true");
    imageViewerImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("#productGrid .card img, .kit-card img").forEach(img => {
    img.addEventListener("click", () => openImageViewer(img.src, img.alt));
  });

  imageViewer.addEventListener("click", (e) => {
    if (e.target === imageViewer) {
      closeImageViewer();
    }
  });

  imageViewerImg.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  function showSection(id){
    document.querySelectorAll("section").forEach(sec=>{
      sec.classList.remove("active");
      sec.style.display="none";
    });
    let section=document.getElementById(id);
    section.style.display="block";
    // Reinicia la vista al inicio de la sección para no quedar en el último producto
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(()=>section.classList.add("active"),50);
    document.querySelector("nav ul").classList.remove("active");
  }
  // MenÃº links
  document.querySelectorAll("nav a").forEach(link=>{
    link.addEventListener("click", e=>{
      e.preventDefault();
      showSection(e.target.dataset.section);
    });
  });
  // Accesos directos desde el inicio hacia otras secciones
  document.querySelectorAll(".hero-showcase-item[data-target-section], .kits-highlight[data-target-section], .hero-service-card[data-target-section]").forEach(item => {
    const targetSection = item.dataset.targetSection;
    item.addEventListener("click", () => showSection(targetSection));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showSection(targetSection);
      }
    });
  });
  const kitsStage = document.querySelector(".kits-highlight-stage");
  if (kitsStage) {
    const kitsFigures = kitsStage.querySelectorAll(".kits-figure");
    let kitsPlayTimer;
    const canAnimateKitsStage = () => window.innerWidth > 720;
    const triggerKitsPlay = () => {
      if (!canAnimateKitsStage()) return;
      kitsStage.classList.remove("is-heart-drawing");
      window.clearTimeout(kitsPlayTimer);
      void kitsStage.offsetWidth;
      kitsStage.classList.add("is-heart-drawing");
      kitsPlayTimer = window.setTimeout(() => {
        kitsStage.classList.remove("is-heart-drawing");
      }, 1750);
    };
    kitsStage.addEventListener("mouseenter", () => {
      if (canAnimateKitsStage()) triggerKitsPlay();
    });
    kitsFigures.forEach(figure => {
      figure.addEventListener("click", (e) => {
        if (!canAnimateKitsStage()) return;
        e.preventDefault();
        e.stopPropagation();
        triggerKitsPlay();
      });
    });
  }
  // Iniciar en Hero
  showSection("hero");
  // MenÃº toggle mÃ³vil
  document.querySelector(".menu-toggle").addEventListener("click", ()=>{
    document.querySelector("nav ul").classList.toggle("active");
  });

  // Ocultar menÃº al hacer clic fuera del menÃº en mÃ³vil
  document.addEventListener("click", function(e) {
    const menuToggle = document.querySelector(".menu-toggle");
    const navUl = document.querySelector("nav ul");
    // Solo aplica en pantallas pequeÃ±as y si el menÃº estÃ¡ abierto
    if (window.innerWidth <= 768 && navUl.classList.contains("active")) {
      // Si el clic NO es en el menÃº ni en el icono del menÃº
      if (!navUl.contains(e.target) && !menuToggle.contains(e.target)) {
        navUl.classList.remove("active");
      }
    }
  });

  // WhatsApp
  function sendWhatsApp(e){
    e.preventDefault();
    let name=document.getElementById("name").value;
    let msg=document.getElementById("message").value;
    let text=`Hola, soy ${name}. Deseo: ${msg}`;
    let url=`https://wa.me/573015379422?text=${encodeURIComponent(text)}`;
    window.open(url,"_blank");
  }
  // Comprar producto
  function buyProduct(product){
    const safeProduct = String(product ?? "").normalize("NFC");
    let text=`Hola, quiero comprar el articulo: ${safeProduct}`;
    let url=`https://wa.me/573015379422?text=${encodeURIComponent(text)}`;
    window.open(url,"_blank");
  }
  // Filtrar productos por bÃºsqueda y categorÃ­a
  function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const category = document.getElementById('productCategory').value;
    document.querySelectorAll('#productGrid .card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const cat = card.getAttribute('data-category');
      const matchCategory = (category === 'todos') || (cat === category);
      const matchSearch = title.includes(search);
      card.style.display = (matchCategory && matchSearch) ? '' : 'none';
    });
  }
  document.getElementById('productSearch').addEventListener('input', filterProducts);
  document.getElementById('productCategory').addEventListener('change', filterProducts);

  // Mostrar input al tocar la lupa en mÃ³vil
  function showSearchInputMobile() {
    const searchBox = document.getElementById('searchBox');
    const input = document.getElementById('productSearch');
    if (window.innerWidth <= 600) {
      searchBox.classList.add('active');
      setTimeout(() => input.focus(), 10);
    }
  }
  document.getElementById('searchIcon').addEventListener('click', showSearchInputMobile);

  // Ocultar input al perder foco en mÃ³vil
  document.getElementById('productSearch').addEventListener('blur', function() {
    if (window.innerWidth <= 600) {
      const searchBox = document.getElementById('searchBox');
      if (!this.value.trim()) {
        searchBox.classList.remove('active');
      }
    }
  });
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 600) return;
    const searchBox = document.getElementById('searchBox');
    const input = document.getElementById('productSearch');
    if (!searchBox.contains(e.target) && !input.value.trim()) {
      searchBox.classList.remove('active');
    }
  });

  // Dropdown personalizado: sincroniza con #productCategory (select oculto) y dispara filterProducts
  (function(){
    const toggle = document.getElementById('selectToggle');
    const list = document.getElementById('selectOptions');
    const label = document.getElementById('selectLabel');
    const hidden = document.getElementById('productCategory');
    const custom = document.getElementById('customCategory');

    function openList(){ list.classList.add('open'); custom.setAttribute('aria-expanded','true'); toggle.setAttribute('aria-expanded','true'); }
    function closeList(){ list.classList.remove('open'); custom.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-expanded','false'); }
    function toggleList(){ list.classList.contains('open') ? closeList() : openList(); }

    // click en botÃ³n
    toggle.addEventListener('click', (e)=>{ e.stopPropagation(); toggleList(); });

    // click en opciÃ³n
    list.addEventListener('click', (e)=>{
      const li = e.target.closest('li');
      if(!li) return;
      // marcar visualmente
      list.querySelectorAll('li').forEach(n=>n.classList.remove('active'));
      li.classList.add('active');
      // actualizar label y select oculto
      label.textContent = li.textContent;
      hidden.value = li.dataset.value;
      // disparar evento change para que filterProducts (ya ligado) se ejecute
      hidden.dispatchEvent(new Event('change', { bubbles:true }));
      closeList();
    });

    // cerrar al hacer clic fuera
    document.addEventListener('click', (e)=>{
      if (!custom.contains(e.target)) closeList();
    });

    // teclado: Esc cierra, Enter/Space abre o selecciona la opciÃ³n focalizada
    document.addEventListener('keydown', (e)=>{
      if(list.classList.contains('open')){
        if(e.key === 'Escape'){ closeList(); toggle.focus(); }
      }
    });

    // inicializar (asegura sync si el select cambia por JS)
    hidden.addEventListener('change', ()=>{
      const val = hidden.value;
      const option = list.querySelector(`li[data-value="${val}"]`);
      if(option){
        list.querySelectorAll('li').forEach(n=>n.classList.remove('active'));
        option.classList.add('active');
        label.textContent = option.textContent;
      }
    });
  })();






