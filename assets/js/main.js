/**
 * Funcionalidades principales de la landing page
 */
(function () {
  'use strict';

  /**
   * Smooth scroll para enlaces ancla
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#inicio') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Muestra un mensaje toast (reemplaza alert)
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    const bgColor = type === 'error' ? '#ff4444' : 'var(--p1)';
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${bgColor};color:white;padding:12px 20px;border-radius:8px;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,.3);font-size:14px;max-width:300px;`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Validación y envío del formulario de contacto (fake)
   */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('#name').value.trim();
      const email = this.querySelector('#email').value.trim();
      const message = this.querySelector('#message').value.trim();
      
      if (!name || !email || !message) {
        showToast('Por favor, completa todos los campos.', 'error');
        return;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Por favor, ingresa un email válido.', 'error');
        return;
      }
      
      // Toast de éxito
      showToast('Mensaje enviado (demo)', 'info');
      this.reset();
    });
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initSmoothScroll();
      initContactForm();
    });
  } else {
    initSmoothScroll();
    initContactForm();
  }
})();

