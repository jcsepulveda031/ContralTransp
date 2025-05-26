# Warehouse 3D View (React + Three.js)

Visualización profesional de almacén en 3D interactivo para selección y gestión de ubicaciones.

## Dependencias necesarias

```
npm install @react-three/fiber @react-three/drei three @mui/material @emotion/react @emotion/styled
```

## Estructura de componentes

- `ControInventarioContent.tsx`: Entrada principal, renderiza la vista 3D.
- `Warehouse3DView.tsx`: Renderiza la maqueta 3D y maneja la selección.
- `WarehouseLocation.tsx`: Renderiza cada ubicación como bloque 3D interactivo.
- `LocationDetailsModal.tsx`: Modal de detalles y acciones sobre la ubicación seleccionada.
- `Legend3D.tsx`: Leyenda visual de estados.

## Uso básico

```tsx
import ControInventarioContent from './ControInventarioContent';

function App() {
  return <ControInventarioContent />;
}
```

## Personalización
- Puedes modificar el array `locations` en `Warehouse3DView.tsx` para definir la cantidad, posición y estado de las ubicaciones.
- Puedes agregar más detalles y acciones en `LocationDetailsModal.tsx`.
- El diseño es responsivo y soporta interacción con mouse (rotar, zoom, seleccionar).

## Ejemplo de ubicación
```js
{
  id: 1,
  x: 0, // posición X en la maqueta
  y: 0, // (no se usa, pero puedes agregar niveles)
  z: 0, // posición Z en la maqueta
  status: 'full' | 'partial' | 'empty',
}
```

## Mejoras sugeridas
- Integrar datos reales desde API.
- Agregar animaciones de movimiento de stock.
- Soporte para niveles (pisos) y zonas especiales.
- Personalizar colores y materiales.

---

**Desarrollado con React, Three.js y Material UI.** 