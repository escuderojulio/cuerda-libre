# Cuerda Libre

Prototipo frontend de la tienda Cuerda Libre, construido con React + Vite.

## Requisitos
- Node.js 20 o superior
- npm

## Ejecutar localmente
```bash
npm install
npm run dev
```
Abre la URL local que indique Vite (normalmente http://localhost:5173).

## Generar versión de producción
```bash
npm run build
npm run preview
```

## Estado actual
- Navegación entre Inicio, Catálogo, Detalle de producto, Asesoría, Carrito, Mi cuenta y Ayuda.
- Catálogo con búsqueda y filtro por categoría.
- Carrito de demostración.
- Formulario de asesoría de demostración.
- Diseño adaptable a móvil y escritorio.
- Los datos son locales/de prueba. No hay backend, autenticación real, pagos ni persistencia.

## Publicación
El proyecto está preparado para desplegarse como aplicación Vite en Vercel:
- Build command: `npm run build`
- Output directory: `dist`
