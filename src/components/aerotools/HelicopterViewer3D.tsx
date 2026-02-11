'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import type { Zone } from '@/lib/aerotools/types';

// ============================================
// TYPES
// ============================================

interface HelicopterViewer3DProps {
  helicopterId: string;
  zones: Zone[];
  selectedZone: string | null;
  equippedZones: string[];
  onZoneClick: (zoneId: string) => void;
  modelPath?: string;
}

interface ZoneHotspotProps {
  zone: Zone;
  isSelected: boolean;
  isEquipped: boolean;
  onClick: () => void;
}

// ============================================
// WEBGL DETECTION
// ============================================

function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ============================================
// ZONE HOTSPOT (3D)
// ============================================

function ZoneHotspot({ zone, isSelected, isEquipped, onClick }: ZoneHotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulse animation
    const scale = isSelected 
      ? 1.3 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      : hovered 
        ? 1.15 
        : 1;
    meshRef.current.scale.setScalar(scale);
    
    // Rotation for equipped zones
    if (isEquipped) {
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  const color = isEquipped 
    ? '#22c55e' // green
    : isSelected 
      ? '#3b82f6' // blue
      : '#6b7280'; // gray
  
  const emissiveIntensity = isSelected || hovered ? 0.5 : 0.2;
  
  return (
    <group position={[zone.position.z, 0.5, -zone.position.x / 20]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Label on hover */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.4, 0]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="at-badge at-badge-blue text-xs px-2 py-1 rounded-md shadow-lg">
            {zone.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================
// HELICOPTER MODEL (Placeholder)
// ============================================

function HelicopterModel({ modelPath }: { modelPath?: string }) {
  // For now, use a placeholder helicopter shape
  // In production, load actual GLB model
  
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.8, 4, 8, 16]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[2.2, 0.3, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Tail boom */}
      <mesh position={[-2.5, 0.2, 0]} rotation={[0, 0, Math.PI / 24]}>
        <cylinderGeometry args={[0.3, 0.15, 3, 8]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Tail rotor */}
      <mesh position={[-4, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.8, 0.05, 0.1]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Main rotor mast */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Main rotor blades */}
      <group position={[0, 1.3, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[5, 0.02, 0.25]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>
      
      {/* Landing gear (retractable style) */}
      <group>
        {/* Front gear */}
        <mesh position={[1.8, -0.9, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.8, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.06, 8, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </mesh>
        
        {/* Main gear left */}
        <mesh position={[0, -0.9, -0.9]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.2, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.08, 8, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </mesh>
        
        {/* Main gear right */}
        <mesh position={[0, -0.9, 0.9]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.2, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.08, 8, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================
// SCENE CONTENT
// ============================================

function SceneContent({
  zones,
  selectedZone,
  equippedZones,
  onZoneClick,
  modelPath,
}: Omit<HelicopterViewer3DProps, 'helicopterId'>) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.3} />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Helicopter model */}
      <Center>
        <HelicopterModel modelPath={modelPath} />
      </Center>
      
      {/* Zone hotspots */}
      {zones.map((zone) => (
        <ZoneHotspot
          key={zone.id}
          zone={zone}
          isSelected={selectedZone === zone.id}
          isEquipped={equippedZones.includes(zone.id)}
          onClick={() => onZoneClick(zone.id)}
        />
      ))}
      
      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={4}
      />
      
      {/* Grid helper */}
      <gridHelper args={[20, 20, '#1f2937', '#111827']} position={[0, -1.5, 0]} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ============================================
// LOADING FALLBACK
// ============================================

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Chargement du modèle 3D...</p>
      </div>
    </div>
  );
}

// ============================================
// WEBGL FALLBACK (2D View)
// ============================================

function WebGLFallback({
  zones,
  selectedZone,
  equippedZones,
  onZoneClick,
}: Omit<HelicopterViewer3DProps, 'helicopterId' | 'modelPath'>) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
      {/* Placeholder helicopter silhouette */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg viewBox="0 0 200 100" className="w-4/5 h-auto">
          <path
            d="M180 50 L160 50 L150 45 L100 45 L90 40 L40 40 L30 45 L20 45 L10 50 L20 55 L40 55 L50 60 L100 60 L110 55 L160 55 L170 50 Z"
            fill="currentColor"
            className="text-blue-500"
          />
          <ellipse cx="100" cy="30" rx="80" ry="3" fill="currentColor" className="text-gray-600" />
        </svg>
      </div>
      
      {/* Zone markers */}
      {zones.map((zone) => {
        const isSelected = selectedZone === zone.id;
        const isEquipped = equippedZones.includes(zone.id);
        
        return (
          <button
            key={zone.id}
            onClick={() => onZoneClick(zone.id)}
            className={`
              absolute w-8 h-8 -ml-4 -mt-4 rounded-full 
              transition-all duration-300 transform
              ${isSelected ? 'scale-125 ring-4 ring-blue-500/50' : 'hover:scale-110'}
              ${isEquipped ? 'bg-green-500' : isSelected ? 'bg-blue-500' : 'bg-gray-600'}
            `}
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
            }}
          >
            <span className="sr-only">{zone.name}</span>
            {isEquipped && (
              <svg className="w-4 h-4 mx-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        );
      })}
      
      {/* Zone labels */}
      {zones.map((zone) => {
        const isSelected = selectedZone === zone.id;
        if (!isSelected) return null;
        
        return (
          <div
            key={`label-${zone.id}`}
            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y - 8}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {zone.name}
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600" />
          <span>Zone disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Zone équipée</span>
        </div>
      </div>
      
      {/* WebGL warning */}
      <div className="absolute top-4 right-4 text-xs text-amber-400 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Vue 2D (WebGL non disponible)
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function HelicopterViewer3D({
  helicopterId,
  zones,
  selectedZone,
  equippedZones,
  onZoneClick,
  modelPath,
}: HelicopterViewer3DProps) {
  const [webglAvailable, setWebglAvailable] = useState(true);
  
  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
  }, []);
  
  if (!webglAvailable) {
    return (
      <WebGLFallback
        zones={zones}
        selectedZone={selectedZone}
        equippedZones={equippedZones}
        onZoneClick={onZoneClick}
      />
    );
  }
  
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [8, 4, 8], fov: 45 }}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent
            zones={zones}
            selectedZone={selectedZone}
            equippedZones={equippedZones}
            onZoneClick={onZoneClick}
            modelPath={modelPath}
          />
        </Canvas>
      </Suspense>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        Glisser pour pivoter • Molette pour zoomer
      </div>
    </div>
  );
}
