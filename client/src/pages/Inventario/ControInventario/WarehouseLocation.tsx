import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

interface Props {
  position: [number, number, number];
  status: 'full' | 'partial' | 'empty';
  selected?: boolean;
  onClick?: () => void;
  name?: string;
}

const statusColor = {
  full: '#e53935',
  partial: '#ffb300',
  empty: '#43a047',
};

const WarehouseLocation: React.FC<Props> = ({ position, status, selected, onClick }) => {
  const ref = useRef<any>(null);
  useCursor(!!onClick);
  useFrame(() => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = selected ? 0.5 : 0.1;
    }
  });
  return (
    <mesh
      ref={ref}
      position={[position[0], position[1] + 0.5, position[2]]}
      onClick={onClick}
      castShadow
      scale={selected ? [1.15, 1.15, 1.15] : [1, 1, 1]}
    >
      <boxGeometry args={[1.2, 1, 1.2]} />
      <meshStandardMaterial
        color={statusColor[status]}
        emissive={selected ? '#fff' : '#000'}
        emissiveIntensity={selected ? 0.5 : 0.1}
        metalness={0.3}
        roughness={0.5}
      />
      {/* Borde de selección */}
      {selected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.25, 1.05, 1.25]} />
          <meshStandardMaterial color="#1976d2" transparent opacity={0.25} />
        </mesh>
      )}
    </mesh>
  );
};

export default WarehouseLocation; 