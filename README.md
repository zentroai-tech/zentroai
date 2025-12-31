# Zentro AI Landing Page

Landing page para Zentro AI - Agents & Automation. Sitio estático optimizado para SEO, accesibilidad y PWA.

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para funcionar en GitHub Pages, tanto en la raíz del dominio como en subdirectorios.

### Pasos para desplegar:

1. **Sube los archivos a un repositorio de GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Habilita GitHub Pages en el repositorio**
   - Ve a **Settings** → **Pages**
   - En **Source**, selecciona la rama `main` (o `master`)
   - En **Folder**, selecciona `/ (root)`
   - Guarda los cambios

3. **Actualiza las URLs de Open Graph** (opcional pero recomendado)
   
   Edita `index.html` y actualiza las URLs en las líneas 14, 17, 22 y 25:
   ```html
   <!-- Cambia https://zentroai.com/ por tu URL de GitHub Pages -->
   <meta property="og:url" content="https://tu-usuario.github.io/tu-repo/" />
   <meta property="og:image" content="https://tu-usuario.github.io/tu-repo/assets/img/logo.png" />
   ```
   
   También actualiza el Schema.org JSON-LD (líneas 38-39):
   ```json
   "url": "https://tu-usuario.github.io/tu-repo",
   "logo": "https://tu-usuario.github.io/tu-repo/assets/img/logo.png"
   ```
   
   Y actualiza `assets/data/content.json` con las mismas URLs.

4. **Espera unos minutos** para que GitHub Pages procese el sitio

5. **Accede a tu sitio** en: `https://tu-usuario.github.io/tu-repo/`

### 📁 Estructura del proyecto

```
zentroai/
├── index.html              # Página principal
├── manifest.json           # Manifest para PWA
├── sw.js                   # Service Worker para PWA
├── README.md               # Este archivo
├── CONTENT_GUIDE.md        # Guía de contenido
└── assets/                 # Recursos organizados
    ├── css/
    │   └── styles.css      # Estilos CSS
    ├── js/
    │   ├── content_loader.js # Cargador de contenido dinámico
    │   ├── main.js         # Smooth scroll y formulario de contacto
    │   └── mobile-menu.js  # Menú móvil (drawer)
    ├── data/
    │   └── content.json    # Contenido dinámico (textos)
    └── img/                # Imágenes
        ├── icono.png       # Logo header
        ├── logo.png        # Logo principal
        └── logo_wall.png   # Hero image
```

### ✨ Características

- ✅ **SEO optimizado**: Open Graph, Twitter Cards, Schema.org JSON-LD
- ✅ **PWA**: Funciona como aplicación web progresiva
- ✅ **Accesible**: Skip links, ARIA labels, prefers-reduced-motion
- ✅ **Responsive**: Diseño adaptable a todos los dispositivos
- ✅ **Performance**: CSS externo cacheable, lazy loading de imágenes
- ✅ **GitHub Pages compatible**: Rutas relativas para funcionar en cualquier subdirectorio

### 🔧 Notas técnicas

- El Service Worker detecta automáticamente si está en la raíz o en un subdirectorio
- Las rutas son relativas para máxima compatibilidad
- El sitio funciona completamente offline después de la primera visita (gracias al Service Worker)

### 📝 Edición de contenido

Para actualizar los textos del sitio sin modificar el HTML, consulta [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md). Este archivo explica cómo funciona el sistema de contenido centralizado en JSON y cómo editar `assets/data/content.json`.

### 📝 Licencia

Este proyecto es propiedad de Zentro AI.
