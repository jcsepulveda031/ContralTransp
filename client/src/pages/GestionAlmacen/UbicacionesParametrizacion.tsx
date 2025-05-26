import React, { useState, useEffect } from 'react';

// Tipos base (ajusta según tu backend)
interface Ubicacion {
  id: number;
  nombre: string;
  tipo: 'picking' | 'alternas';
  nivel: string;
}

interface Nivel {
  nombre: string;
  picking: Ubicacion[];
  alternas: Ubicacion[];
}

interface Columna {
  nombre: string;
  niveles: Nivel[];
}

interface UbicacionesParametrizacionProps {
  almacenId: number;
  almacenNombre: string;
}

const UbicacionesParametrizacion: React.FC<UbicacionesParametrizacionProps> = ({ almacenId, almacenNombre }) => {
  // Estado principal
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CARGA INICIAL ---
  useEffect(() => {
    // TODO: Llama aquí a tu servicio para obtener la estructura inicial
    // Ejemplo:
    // fetchColumnas(almacenId).then(data => setColumnas(data)).finally(() => setLoading(false));
    setLoading(false);
  }, [almacenId]);

  // --- AGREGAR NIVEL ---
  const agregarNivel = (idxCol: number, nombreNivel: string) => {
    // TODO: Llama a tu servicio para crear nivel
    // await createNivel(columna, nombreNivel)
    setColumnas(prev => {
      const nuevas = [...prev];
      nuevas[idxCol].niveles.push({ nombre: nombreNivel, picking: [], alternas: [] });
      return nuevas;
    });
  };

  // --- AGREGAR UBICACION ---
  const agregarUbicacion = (idxCol: number, idxNivel: number, tipo: 'picking' | 'alternas', nombre: string) => {
    // TODO: Llama a tu servicio para crear ubicación
    // await createUbicacion(columna, nivel, tipo, nombre)
    setColumnas(prev => {
      const nuevas = [...prev];
      nuevas[idxCol].niveles[idxNivel][tipo].push({
        id: Date.now(), // Reemplaza por el id real del backend
        nombre,
        tipo,
        nivel: nuevas[idxCol].niveles[idxNivel].nombre,
      });
      return nuevas;
    });
  };

  // --- EDITAR UBICACION ---
  const editarUbicacion = (idxCol: number, idxNivel: number, tipo: 'picking' | 'alternas', id: number, nuevoNombre: string) => {
    // TODO: Llama a tu servicio para editar ubicación
    // await updateUbicacion(id, nuevoNombre)
    setColumnas(prev => {
      const nuevas = [...prev];
      const ubic = nuevas[idxCol].niveles[idxNivel][tipo].find((u: Ubicacion) => u.id === id);
      if (ubic) ubic.nombre = nuevoNombre;
      return nuevas;
    });
  };

  // --- ELIMINAR UBICACION ---
  const eliminarUbicacion = (idxCol: number, idxNivel: number, tipo: 'picking' | 'alternas', id: number) => {
    // TODO: Llama a tu servicio para eliminar ubicación
    // await deleteUbicacion(id)
    setColumnas(prev => {
      const nuevas = [...prev];
      nuevas[idxCol].niveles[idxNivel][tipo] = nuevas[idxCol].niveles[idxNivel][tipo].filter((u: Ubicacion) => u.id !== id);
      return nuevas;
    });
  };

  // --- AGREGAR COLUMNA (opcional) ---
  const agregarColumna = (nombre: string) => {
    // TODO: Llama a tu servicio para crear columna
    setColumnas(prev => ([...prev, { nombre, niveles: [] }]));
  };

  const getNextColumnName = () => {
    if (columnas.length === 0) return 'A';
    const lastCol = columnas[columnas.length - 1].nombre;
    return String.fromCharCode(lastCol.charCodeAt(0) + 1);
  };

  const getNextLocationName = (idxCol: number, idxNivel: number, tipo: 'picking' | 'alternas') => {
    const col = columnas[idxCol];
    const nivel = col.niveles[idxNivel];
    const ubicaciones = nivel[tipo];
    if (ubicaciones.length === 0) return `${col.nombre}${nivel.nombre}1`;
    const lastUbic = ubicaciones[ubicaciones.length - 1].nombre;
    const match = lastUbic.match(/([A-Za-z]+)(\d+)/);
    if (match) {
      const [, prefix, num] = match;
      return `${prefix}${parseInt(num) + 1}`;
    }
    return `${col.nombre}${nivel.nombre}1`;
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="parametrizacion-ubicaciones">
      <h2>Parametrización de Ubicaciones - {almacenNombre}</h2>
      <button onClick={() => {
        const sugerencia = getNextColumnName();
        const nombre = prompt('Nombre de la nueva columna:', sugerencia);
        if (nombre) agregarColumna(nombre);
      }}>Agregar Columna</button>
      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        {columnas.map((col, idxCol) => (
          <div key={col.nombre} className="columna-card" style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 300 }}>
            <h3>Columna {col.nombre}</h3>
            <button onClick={() => {
              const nombreNivel = prompt('Nombre del nuevo nivel:');
              if (nombreNivel) agregarNivel(idxCol, nombreNivel);
            }}>Agregar Nivel</button>
            {col.niveles.map((nivel, idxNivel) => (
              <div key={nivel.nombre} className="nivel-card" style={{ marginTop: 16, background: '#f9f9f9', borderRadius: 6, padding: 12 }}>
                <h4>{nivel.nombre}</h4>
                {/* Picking */}
                <div>
                  <h5>Ubicaciones Picking</h5>
                  <FormularioInline 
                    onSubmit={nombre => agregarUbicacion(idxCol, idxNivel, 'picking', nombre)} 
                    sugerencia={getNextLocationName(idxCol, idxNivel, 'picking')} 
                  />
                  {nivel.picking.map(ubic => (
                    <div key={ubic.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{ubic.nombre}</span>
                      <button onClick={() => {
                        const nuevoNombre = prompt('Nuevo nombre:', ubic.nombre);
                        if (nuevoNombre) editarUbicacion(idxCol, idxNivel, 'picking', ubic.id, nuevoNombre);
                      }}>Editar</button>
                      <button onClick={() => eliminarUbicacion(idxCol, idxNivel, 'picking', ubic.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
                {/* Alternas */}
                <div style={{ marginTop: 8 }}>
                  <h5>Ubicaciones Alternas</h5>
                  <FormularioInline 
                    onSubmit={nombre => agregarUbicacion(idxCol, idxNivel, 'alternas', nombre)} 
                    sugerencia={getNextLocationName(idxCol, idxNivel, 'alternas')} 
                  />
                  {nivel.alternas.map(ubic => (
                    <div key={ubic.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{ubic.nombre}</span>
                      <button onClick={() => {
                        const nuevoNombre = prompt('Nuevo nombre:', ubic.nombre);
                        if (nuevoNombre) editarUbicacion(idxCol, idxNivel, 'alternas', ubic.id, nuevoNombre);
                      }}>Editar</button>
                      <button onClick={() => eliminarUbicacion(idxCol, idxNivel, 'alternas', ubic.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Formulario inline para agregar ubicaciones
const FormularioInline: React.FC<{ onSubmit: (nombre: string) => void; sugerencia: string }> = ({ onSubmit, sugerencia }) => {
  const [nombre, setNombre] = useState(sugerencia);
  return (
    <form
      style={{ display: 'flex', gap: 8, margin: '8px 0' }}
      onSubmit={e => {
        e.preventDefault();
        if (nombre.trim()) {
          onSubmit(nombre.trim());
          setNombre(sugerencia);
        }
      }}
    >
      <input
        type="text"
        placeholder="Nombre ubicación"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        style={{ flex: 1 }}
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

export default UbicacionesParametrizacion; 