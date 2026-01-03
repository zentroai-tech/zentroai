/**
 * Menú móvil (drawer): funcionalidad de apertura/cierre
 */
(function () {
  'use strict';

  let isInitialized = false;
  let retryCount = 0;
  const MAX_RETRIES = 10;

  // Funciones de handler
  let openDrawerHandler, closeDrawerHandler, backdropHandler, escapeHandler;
  let drawerLinkHandlers = [];

  /**
   * Abre el drawer móvil y bloquea el scroll del body
   */
  function openDrawer() {
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const menuBtn = document.getElementById("menuBtn");
    
    if (!drawer || !backdrop || !menuBtn) return;
    
    drawer.classList.add("open");
    drawer.style.setProperty("right", "0px", "important");
    backdrop.style.display = "block";
    document.body.classList.add("no-scroll");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  /**
   * Cierra el drawer móvil y restaura el scroll del body
   */
  function closeDrawer() {
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const menuBtn = document.getElementById("menuBtn");
    
    if (!drawer || !backdrop || !menuBtn) return;
    
    drawer.classList.remove("open");
    drawer.style.setProperty("right", "-100%", "important");
    backdrop.style.display = "none";
    document.body.classList.remove("no-scroll");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  // Función para inicializar el menú móvil
  function initMobileMenu() {
    // Evitar múltiples inicializaciones
    if (isInitialized) return;

    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const closeBtn = document.getElementById("drawerClose");

    // Verificar que los elementos críticos existan
    if (!menuBtn || !drawer || !backdrop) {
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        setTimeout(initMobileMenu, 150);
      }
      return;
    }

    // Obtener links del drawer
    const drawerLinks = drawer.querySelectorAll("[data-drawer-link]");

    // Crear handlers
    openDrawerHandler = function(e) {
      if (e) e.stopPropagation();
      openDrawer();
    };

    closeDrawerHandler = function(e) {
      if (e) e.stopPropagation();
      closeDrawer();
    };

    backdropHandler = function(e) {
      if (e) e.stopPropagation();
      closeDrawer();
    };

    // Event listeners: abrir/cerrar drawer
    menuBtn.addEventListener("click", openDrawerHandler);
    menuBtn.addEventListener("touchstart", openDrawerHandler, { passive: true });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeDrawerHandler);
      closeBtn.addEventListener("touchstart", closeDrawerHandler, { passive: true });
    }
    
    backdrop.addEventListener("click", backdropHandler);
    backdrop.addEventListener("touchstart", backdropHandler, { passive: true });

    // Cerrar drawer al hacer click en cualquier link interno y navegar a la sección
    drawerLinks.forEach((a) => {
      const handler = function(e) {
        e.preventDefault(); // Prevenir comportamiento por defecto
        const href = a.getAttribute('href');
        
        if (href && href !== '#' && href !== '#inicio') {
          closeDrawer(); // Cerrar drawer primero
          
          // Esperar a que el drawer se cierre antes de hacer scroll
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200); // Delay para que la animación del drawer termine
        } else {
          closeDrawer();
        }
      };
      drawerLinkHandlers.push({ element: a, handler: handler });
      a.addEventListener("click", handler);
      a.addEventListener("touchstart", handler, { passive: true });
    });

    // Cerrar drawer con tecla Escape (accesibilidad)
    escapeHandler = function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", escapeHandler);

    isInitialized = true;
  }

  // Función para esperar a que content_loader.js termine
  function waitForContentLoader(callback, maxWait = 3000) {
    let waited = 0;
    const checkInterval = setInterval(() => {
      if (window.contentData || window.contentLoader || waited >= maxWait) {
        clearInterval(checkInterval);
        callback();
      }
      waited += 100;
    }, 100);
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForContentLoader(initMobileMenu);
    });
  } else {
    waitForContentLoader(initMobileMenu);
  }
})();

