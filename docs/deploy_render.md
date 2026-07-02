# Desplegar el backend en Render (rápido)

Este documento explica cómo desplegar el backend en Render y configurar el frontend (GitHub Pages) para que apunte al backend público.

1. Crea una cuenta en https://dashboard.render.com (puedes usar "Sign in with GitHub").
2. En Render, elige **New → Import from GitHub** y selecciona el repositorio `HIGHLAND-CODE/CC611`.
3. Render detectará `render.yaml` y sugerirá crear un servicio. Si no aparece automáticamente, crea un **Web Service** con estos valores:
   - Branch: `main`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: `Node`
   - Plan: `Free`
4. Haz click en **Create Service**. Render hará build y deploy. Cuando termine, tendrás una URL pública, por ejemplo `https://cc611-backend.onrender.com`.
5. Actualiza `frontend/index.html` para exponer la URL pública al frontend. En `frontend/index.html` busca el script que define `window.__API_BASE__` y reemplaza la línea:

```html
    // window.__API_BASE__ = 'https://mi-backend.onrender.com/api';
    window.__API_BASE__ = window.__API_BASE__ || '/api';
```

por:

```html
    window.__API_BASE__ = 'https://TU_SERVICIO.onrender.com/api';
```

6. Commit y push de `frontend/index.html` al repo si quieres que GitHub Pages use la URL pública.

Notas importantes:
- El almacenamiento en disco de Render es efímero. Si tu app sube archivos (uploads) usa un servicio externo (S3, Cloud Storage).
- El plan gratuito puede dormir la app tras inactividad. Para demos activas, considera un plan de pago.
