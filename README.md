# COBRANZAS-611

Proyecto completo de cobranza para vendedores preventistas.

## Tecnologías
- Frontend: HTML5, CSS3, JavaScript Vanilla, Bootstrap 5, SheetJS
- Backend: Node.js, Express, Multer, XLSX
- Persistencia: JSON local inicialmente

## Estructura del proyecto
- `backend/`
  - `server.js`
  - `package.json`
  - `routes/`
  - `controllers/`
  - `services/`
  - `middlewares/`
  - `config/`
  - `uploads/`
  - `data/`
- `frontend/`
  - `index.html`
  - `admin.html`
  - `vendedor.html`
- `css/styles.css`
- `js/api.js`
- `js/auth.js`
- `js/admin.js`
- `js/vendedor.js`

## Instalación

1. Abre la terminal en la carpeta del proyecto:

```bash
cd "c:\Users\aleja\Desktop\app cuentas corrientes\backend"
```

2. Instala las dependencias:

```bash
npm install
```

## Ejecución

- En modo desarrollo:

```bash
npm run dev
```

- En producción:

```bash
npm start
```

## Rutas importantes
- `GET /` - Página de login
- `POST /api/auth/login` - Autenticación
- `POST /api/admin/upload/deudas` - Subir archivo de deudas
- `POST /api/admin/upload/visitas` - Subir archivo de visitas
- `GET /api/ruta/:vendedor` - Obtener ruta diaria del vendedor
- `POST /api/cobranzas` - Registrar cobranza
- `GET /api/cobranzas` - Listar cobranzas

## Credenciales
- Administrador:
  - Usuario: `admin`
  - Clave: `611admin`
- Vendedores:
  - `V31`, `V32`, ..., `V65`
  - Claves: `V31pass`, `V32pass`, ..., `V65pass`

## Notas
- Los archivos XLSX deben tener las columnas esperadas.
- Se validan archivos con tamaño máximo `10 MB`.
- Los comprobantes y retenciones se guardan en `backend/uploads/comprobantes` y `backend/uploads/retenciones`.
- Se usa persistencia local con JSON y es posible migrar a PostgreSQL en futuras mejoras.
