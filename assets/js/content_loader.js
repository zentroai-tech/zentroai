/**
 * Cargador de contenido desde JSON
 * Reemplaza textos en el HTML usando data attributes
 */
(function () {
  'use strict';

  // Flag de desarrollo: cambiar a false en producción
  const DEBUG = false;

  let content = null;

  /**
   * Valida la estructura básica del contenido JSON
   */
  function validarEstructura(data) {
    if (!data || typeof data !== 'object') {
      return { valido: false, error: 'El contenido no es un objeto válido' };
    }

    const camposRequeridos = ['meta', 'brand', 'hero', 'ofrecemos', 'paraQuien', 'comoTrabajamos', 'contacto'];
    for (const campo of camposRequeridos) {
      if (!(campo in data)) {
        return { valido: false, error: `Falta el campo requerido: ${campo}` };
      }
    }

    // Validar estructura de contacto (crítico para funcionalidad)
    if (!data.contacto || !data.contacto.canales) {
      return { valido: false, error: 'Falta la estructura de contacto.canales' };
    }

    return { valido: true };
  }

  async function cargarContent() {
    try {
      const response = await fetch('./assets/data/content.json');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Validar estructura
      const validacion = validarEstructura(data);
      if (!validacion.valido) {
        throw new Error(`Error de validación: ${validacion.error}`);
      }

      content = data;
      return content;
    } catch (error) {
      if (DEBUG) {
        console.error('Error cargando contenido:', error);
      }
      // Mostrar error visible al usuario si falla la carga
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff4444;color:#fff;padding:1rem;text-align:center;z-index:9999;';
      errorMsg.textContent = 'Error al cargar el contenido. Por favor, recarga la página.';
      document.body.appendChild(errorMsg);
      return null;
    }
  }

  /**
   * Actualiza los meta tags del head
   */
  function actualizarMetaTags() {
    if (!content) return;

    const meta = content.meta;

    // Title
    document.title = meta.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', meta.description);

    // Open Graph
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.og.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.og.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', meta.og.url);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', meta.og.image);

    // Twitter Card
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', meta.twitter.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', meta.twitter.description);
    document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', meta.twitter.url);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', meta.twitter.image);

    // Schema.org JSON-LD - crear si no existe
    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: meta.schema.name,
      description: meta.schema.description,
      url: meta.schema.url,
      logo: meta.schema.logo,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: meta.schema.telephone,
        contactType: 'customer service',
        availableLanguage: ['Spanish']
      },
      sameAs: [meta.schema.instagram],
      email: meta.schema.email
    };
    schemaScript.textContent = JSON.stringify(schemaData);
  }

  /**
   * Reemplaza texto en un elemento usando data-texto attribute
   */
  function aplicarTexto(elemento, ruta) {
    if (!elemento || !content) return;

    const partes = ruta.split('.');
    let valor = content;

    for (const parte of partes) {
      if (valor && typeof valor === 'object' && parte in valor) {
        valor = valor[parte];
      } else {
        if (DEBUG) {
          console.warn(`Ruta no encontrada: ${ruta}`);
        }
        return;
      }
    }

    if (typeof valor === 'string') {
      // Si el elemento es un input/textarea, usar value
      if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
        elemento.value = valor;
      } 
      // Si es una imagen, actualizar alt
      else if (elemento.tagName === 'IMG') {
        elemento.setAttribute('alt', valor);
      }
      // Si tiene data-html, usar innerHTML con sanitización básica
      else if (elemento.hasAttribute('data-html')) {
        // Sanitización básica: solo permitir tags seguros (b, strong, em, i, u, br, span)
        // Escapar todo primero, luego permitir solo tags seguros
        const sanitized = valor
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/&lt;(\/?)(b|strong|em|i|u|br|span)(\s[^&]*)?&gt;/gi, '<$1$2$3>')
          .replace(/&amp;/g, '&');
        elemento.innerHTML = sanitized;
      } 
      // Por defecto, usar textContent
      else {
        elemento.textContent = valor;
      }
    } else if (typeof valor === 'object') {
      if (DEBUG) {
        console.warn(`El valor en ${ruta} es un objeto, no un string`);
      }
    }
  }

  /**
   * Aplica textos usando data-texto attributes
   */
  function aplicarTextos() {
    if (!content) return;

    // Buscar todos los elementos con data-texto
    const elementos = document.querySelectorAll('[data-texto]');
    elementos.forEach((el) => {
      const ruta = el.getAttribute('data-texto');
      aplicarTexto(el, ruta);
    });

    // Aplicar textos específicos que requieren lógica especial
    aplicarTextosEspeciales();
  }

  /**
   * Aplica textos que requieren lógica especial (arrays, estructuras complejas)
   */
  function aplicarTextosEspeciales() {
    if (!content) return;

    // Brand - usar textContent para preservar elementos y estilos
    const brandName = document.querySelector('[data-texto="brand.name"]');
    if (brandName) brandName.textContent = content.brand.name;
    const brandTagline = document.querySelector('[data-texto="brand.tagline"]');
    if (brandTagline) brandTagline.textContent = content.brand.tagline;

    // Hero metrics
    const metric1 = document.querySelector('[data-texto="hero.metrics.atencion24.title"]');
    const metric1Desc = document.querySelector('[data-texto="hero.metrics.atencion24.description"]');
    if (metric1) metric1.textContent = content.hero.metrics.atencion24.title;
    if (metric1Desc) metric1Desc.textContent = content.hero.metrics.atencion24.description;

    const metric2 = document.querySelector('[data-texto="hero.metrics.leads.title"]');
    const metric2Desc = document.querySelector('[data-texto="hero.metrics.leads.description"]');
    if (metric2) metric2.textContent = content.hero.metrics.leads.title;
    if (metric2Desc) metric2Desc.textContent = content.hero.metrics.leads.description;

    const metric3 = document.querySelector('[data-texto="hero.metrics.integracion.title"]');
    const metric3Desc = document.querySelector('[data-texto="hero.metrics.integracion.description"]');
    if (metric3) metric3.textContent = content.hero.metrics.integracion.title;
    if (metric3Desc) metric3Desc.textContent = content.hero.metrics.integracion.description;

    // Cards de "Qué ofrecemos"
    const cardsOfrecemos = document.querySelectorAll('[data-texto-card="ofrecemos"]');
    cardsOfrecemos.forEach((card, index) => {
      if (content.ofrecemos.cards[index]) {
        const cardData = content.ofrecemos.cards[index];
        const titleEl = card.querySelector('[data-texto-card-title]');
        if (titleEl) titleEl.textContent = cardData.title;
        const descEl = card.querySelector('[data-texto-card-desc]');
        if (descEl) {
          if (descEl.hasAttribute('data-html')) {
            descEl.innerHTML = cardData.description;
          } else {
            descEl.textContent = cardData.description;
          }
        }
        const pillEl = card.querySelector('[data-texto-card-pill]');
        if (pillEl) pillEl.textContent = cardData.pill;
        const iconEl = card.querySelector('[data-texto-card-icon]');
        if (iconEl) iconEl.textContent = cardData.icon;
      }
    });

    // Steps de "Cómo trabajamos" (usando data-texto-step)
    const stepsTrabajo = document.querySelectorAll('[data-texto-step="comoTrabajamos"]');
    stepsTrabajo.forEach((step, index) => {
      if (content.comoTrabajamos.cards[index]) {
        const stepData = content.comoTrabajamos.cards[index];
        const titleEl = step.querySelector('[data-texto-step-title]');
        if (titleEl) titleEl.textContent = stepData.title;
        const descEl = step.querySelector('[data-texto-step-desc]');
        if (descEl) descEl.textContent = stepData.description;
        const numberEl = step.querySelector('[data-texto-step-number]');
        if (numberEl) numberEl.textContent = stepData.icon;
      }
    });

    // Listas de "Para quién"
    const itemsIdealPara = document.querySelectorAll('[data-texto-list="idealPara"]');
    itemsIdealPara.forEach((item, index) => {
      if (content.paraQuien.idealPara.items[index]) {
        const itemData = content.paraQuien.idealPara.items[index];
        const titleEl = item.querySelector('[data-texto-list-title]');
        if (titleEl) titleEl.textContent = itemData.title;
        const descEl = item.querySelector('[data-texto-list-desc]');
        if (descEl) descEl.textContent = itemData.description;
      }
    });

    const itemsProblemas = document.querySelectorAll('[data-texto-list="problemas"]');
    itemsProblemas.forEach((item, index) => {
      if (content.paraQuien.problemas.items[index]) {
        const itemData = content.paraQuien.problemas.items[index];
        const titleEl = item.querySelector('[data-texto-list-title]');
        if (titleEl) titleEl.textContent = itemData.title;
        const descEl = item.querySelector('[data-texto-list-desc]');
        if (descEl) descEl.textContent = itemData.description;
      }
    });

    // Requisitos de contacto (usando data-texto-requisito)
    const itemsRequisitos = document.querySelectorAll('[data-texto-requisito="contacto.requisitos"]');
    itemsRequisitos.forEach((item, index) => {
      if (content.contacto.requisitos.items[index]) {
        const itemData = content.contacto.requisitos.items[index];
        const titleEl = item.querySelector('[data-texto-requisito-title]');
        if (titleEl) titleEl.textContent = itemData.title;
        const descEl = item.querySelector('[data-texto-requisito-desc]');
        if (descEl) descEl.textContent = itemData.description;
      }
    });

    // Contacto - Canales
    // Actualizar email (ya se actualiza con data-texto, pero aseguramos el href)
    const emailTxt = document.getElementById('emailTxt');
    if (emailTxt && content.contacto.canales.email) {
      emailTxt.textContent = content.contacto.canales.email.value;
    }

    // Actualizar hrefs dinámicamente usando data-href attribute
    const linksWithHref = document.querySelectorAll('[data-href]');
    linksWithHref.forEach((link) => {
      const ruta = link.getAttribute('data-href');
      const partes = ruta.split('.');
      let valor = content;
      
      for (const parte of partes) {
        if (valor && typeof valor === 'object' && parte in valor) {
          valor = valor[parte];
        } else {
          if (DEBUG) {
            console.warn(`Ruta href no encontrada: ${ruta}`);
          }
          return;
        }
      }
      
      if (typeof valor === 'string' && valor.trim() !== '') {
        link.setAttribute('href', valor);
      }
    });

    // Actualizar hrefs de contacto dinámicamente (fallback para compatibilidad)
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    if (content.contacto.canales.email?.href) {
      emailLinks.forEach((link) => {
        if (!link.hasAttribute('data-href')) {
          link.setAttribute('href', content.contacto.canales.email.href);
        }
      });
    }

    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    if (content.contacto.canales.whatsapp?.href) {
      whatsappLinks.forEach((link) => {
        if (!link.hasAttribute('data-href')) {
          link.setAttribute('href', content.contacto.canales.whatsapp.href);
        }
      });
    }

    // Actualizar Instagram link si existe
    const instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
    if (content.contacto.canales.instagram?.href) {
      instagramLinks.forEach((link) => {
        if (!link.hasAttribute('data-href')) {
          link.setAttribute('href', content.contacto.canales.instagram.href);
        }
      });
    }

    // Actualizar aria-label del nav
    const nav = document.querySelector('nav.nav');
    if (nav && content.navigation.sections) {
      nav.setAttribute('aria-label', content.navigation.sections);
    }

    // Actualizar textos dinámicos en JavaScript
    window.contentData = content;
  }

  /**
   * Inicializa el sistema de contenido
   * Carga content.json, actualiza meta tags y aplica textos al DOM
   */
  async function init() {
    await cargarContent();
    if (content) {
      actualizarMetaTags(); // SEO: Open Graph, Twitter Cards, Schema.org
      aplicarTextos(); // Reemplaza textos usando data-texto attributes
    }
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exportar para uso en otros scripts
  window.contentLoader = {
    getContent: () => content,
    aplicarTexto: aplicarTexto
  };
})();

