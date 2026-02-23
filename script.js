const THEME_KEY = "visionary-theme";
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme){
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    themeToggle.textContent = isLight ? "Modo oscuro" : "Modo claro";
    themeToggle.setAttribute("aria-label", isLight ? "Activar modo oscuro" : "Activar modo claro");
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", ()=>{
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  // Mostrar solo una sección
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

  document.querySelectorAll("#productGrid .card img").forEach(img => {
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
    setTimeout(()=>section.classList.add("active"),50);
    document.querySelector("nav ul").classList.remove("active");
  }
  // Menú links
  document.querySelectorAll("nav a").forEach(link=>{
    link.addEventListener("click", e=>{
      e.preventDefault();
      showSection(e.target.dataset.section);
    });
  });
  // Iniciar en Hero
  showSection("hero");
  // Menú toggle móvil
  document.querySelector(".menu-toggle").addEventListener("click", ()=>{
    document.querySelector("nav ul").classList.toggle("active");
  });

  // Ocultar menú al hacer clic fuera del menú en móvil
  document.addEventListener("click", function(e) {
    const menuToggle = document.querySelector(".menu-toggle");
    const navUl = document.querySelector("nav ul");
    // Solo aplica en pantallas pequeñas y si el menú está abierto
    if (window.innerWidth <= 768 && navUl.classList.contains("active")) {
      // Si el clic NO es en el menú ni en el icono del menú
      if (!navUl.contains(e.target) && !menuToggle.contains(e.target)) {
        navUl.classList.remove("active");
      }
    }
  });

  // WhatsApp
  function sendWhatsApp(e){
    e.preventDefault();
    let name=document.getElementById("name").value;
    let phone=document.getElementById("phone").value;
    let msg=document.getElementById("message").value;
    let text=`Hola, soy ${name}. Mi número es ${phone}. Deseo: ${msg}`;
    let url=`https://wa.me/573007258766?text=${encodeURIComponent(text)}`;
    window.open(url,"_blank");
  }
  // Comprar producto
  function buyProduct(product){
    let text=`Hola, quiero comprar el artículo: ${product}`;
    let url=`https://wa.me/573007258766?text=${encodeURIComponent(text)}`;
    window.open(url,"_blank");
  }
  // Filtrar productos por búsqueda y categoría
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

  // Mostrar input al tocar la lupa en móvil
  function showSearchInputMobile() {
    const searchBox = document.getElementById('searchBox');
    const input = document.getElementById('productSearch');
    if (window.innerWidth <= 600) {
      searchBox.classList.add('active');
      input.style.display = 'block';
      input.focus();
    }
  }
  document.getElementById('searchIcon').addEventListener('click', showSearchInputMobile);

  // Ocultar input al perder foco en móvil
  document.getElementById('productSearch').addEventListener('blur', function() {
    if (window.innerWidth <= 600) {
      document.getElementById('searchBox').classList.remove('active');
      this.style.display = 'none';
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

    // click en botón
    toggle.addEventListener('click', (e)=>{ e.stopPropagation(); toggleList(); });

    // click en opción
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

    // teclado: Esc cierra, Enter/Space abre o selecciona la opción focalizada
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



