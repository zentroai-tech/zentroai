# Sistema de Contenido - Zentro AI Landing

Este proyecto ahora utiliza un sistema de contenido centralizado en JSON para facilitar las actualizaciones de textos.

## Archivos

- **`content.json`**: Contiene todos los textos del sitio organizados por secciones
- **`content_loader.js`**: Script que carga y aplica los textos al HTML
- **`index.html`**: HTML con atributos `data-texto` que referencian las rutas en el JSON

## Cómo actualizar textos

### 1. Editar `content.json`

Abre `content.json` y busca la sección que quieres modificar. Por ejemplo:

```json
{
  "hero": {
    "title": "Zentro AI",
    "subtitle": "Agentes \"nativos\" que venden..."
  }
}
```

### 2. Estructura del JSON

Los textos están organizados por secciones:

- `meta`: Meta tags (title, description, Open Graph, Twitter Cards, Schema.org)
- `brand`: Nombre y tagline de la marca
- `navigation`: Menús y navegación
- `hero`: Sección principal (hero)
- `ofrecemos`: Cards de "Qué ofrecemos"
- `paraQuien`: Sección "Para quién"
- `comoTrabajamos`: Cards de "Cómo trabajamos"
- `contacto`: Información de contacto
- `footer`: Footer y política de uso
- `js`: Textos usados en JavaScript

### 3. Ejemplos de actualización

**Cambiar el título principal:**
```json
"hero": {
  "title": "Tu nuevo título aquí"
}
```

**Cambiar una card de "Qué ofrecemos":**
```json
"ofrecemos": {
  "cards": [
    {
      "title": "Nuevo título",
      "description": "Nueva descripción",
      "pill": "Nuevo pill"
    }
  ]
}
```

**Cambiar información de contacto:**
```json
"contacto": {
  "canales": {
    "email": {
      "value": "nuevo@email.com",
      "href": "mailto:nuevo@email.com"
    }
  }
}
```

## Notas importantes

1. **HTML preservado**: Si un texto contiene HTML (como `<b>negrita</b>`), agrega `data-html="true"` al elemento en el HTML
2. **Arrays**: Las cards y listas usan arrays. Asegúrate de mantener el mismo orden
3. **Meta tags**: Los meta tags se actualizan automáticamente desde el JSON
4. **Contactos**: Los links de email y WhatsApp se actualizan automáticamente

## Cómo funciona

1. Al cargar la página, `content_loader.js` carga `content.json`
2. El script busca todos los elementos con `data-texto` en el HTML
3. Reemplaza el contenido de esos elementos con los valores del JSON
4. Actualiza los meta tags dinámicamente

## Fallback

Si el JSON no carga por alguna razón, el HTML mantiene los textos originales como fallback, así que el sitio seguirá funcionando.

