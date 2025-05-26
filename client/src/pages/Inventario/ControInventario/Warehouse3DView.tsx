import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import WarehouseLocation from './WarehouseLocation';
import LocationDetailsModal from './LocationDetailsModal';
import Legend3D from './Legend3D';

const COLUMNS = 6;
const LEVELS = 4;
const POSITIONS = 2;

const generateLocations = () => {
  const arr = [];
  for (let col = 0; col < COLUMNS; col++) {
    for (let lvl = 0; lvl < LEVELS; lvl++) {
      for (let pos = 0; pos < POSITIONS; pos++) {
        arr.push({
          id: `${col}-${lvl}-${pos}`,
          col,
          lvl,
          pos,
          status: (col + lvl + pos) % 3 === 0 ? 'full' : (col + lvl + pos) % 3 === 1 ? 'partial' : 'empty',
          name: `C${col + 1}-N${lvl + 1}-P${pos + 1}`,
          capacidad: 100,
          stock: 50 + ((col + lvl + pos) * 5) % 50,
          unidades: [
            { sku: 'SKU-99999', unidad: 'PALLET-010', cantidad: 6 },
            { sku: 'SKU-54321', unidad: 'PALLET-005', cantidad: 16 }
          ]
        });
      }
    }
  }
  return arr;
};

const Warehouse3DView: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [locations] = useState(generateLocations());
  const selectedLocation = locations.find(l => l.id === selected) || null;

  return (
    <>
      <Canvas shadows style={{ width: '100vw', height: '100vh', background: '#181c24' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <PerspectiveCamera makeDefault position={[10, 10, 15]} fov={50} />
        <OrbitControls enablePan enableZoom enableRotate />
        {/* Piso */}
        <mesh receiveShadow position={[COLUMNS, -0.51, POSITIONS]}>
          <boxGeometry args={[COLUMNS * 2.5, 1, POSITIONS * 2.5]} />
          <meshStandardMaterial color="#23272f" />
        </mesh>
        {/* Renderizar ubicaciones */}
        {locations.map(loc => (
          <WarehouseLocation
            key={loc.id}
            position={[loc.col * 2.5, loc.lvl * 1.3, loc.pos * 2.5]}
            status={loc.status as 'full' | 'partial' | 'empty'}
            selected={selected === loc.id}
            onClick={() => setSelected(loc.id)}
            name={loc.name}
          />
        ))}
      </Canvas>
      <Legend3D />
      <LocationDetailsModal
        open={!!selected}
        location={selectedLocation}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default Warehouse3DView; 