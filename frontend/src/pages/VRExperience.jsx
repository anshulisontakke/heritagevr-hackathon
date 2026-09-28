import { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Float } from '@react-three/drei';
import api from '../services/api';
import { ArrowLeft, Maximize, PlayCircle, Info, Heart, AlertCircle } from 'lucide-react';

// Placeholder 3D Heritage Monument Component
const MonumentPlaceholder = ({ siteName }) => {
  return (
    <group position={[0, -1, 0]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 1, 8]} />
        <meshStandardMaterial color="#c9a54e" roughness={0.8} />
      </mesh>
      
      {/* Pillars */}
      {[[-3, -3], [-3, 3], [3, -3], [3, 3]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 3, pos[1]]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.5, 4, 16]} />
          <meshStandardMaterial color="#d4a574" roughness={0.9} />
        </mesh>
      ))}

      {/* Main Structure */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.7} />
      </mesh>
      
      {/* Roof/Dome */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <coneGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color="#a07e2e" roughness={0.6} />
      </mesh>

      {/* 3D Text Label */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <Text
          position={[0, 8, 0]}
          fontSize={0.6}
          color="#00d4ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {siteName}
        </Text>
        <Text
          position={[0, 7.3, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Digital Twin (Demo Placeholder)
        </Text>
      </Float>
    </group>
  );
};

export default function VRExperience() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        const res = await api.getSite(id);
        setSite(res.data);
      } catch (err) {
        setError('Failed to load VR experience.');
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="spinner"></div></div>;
  if (error || !site) return <div className="min-h-screen flex items-center justify-center bg-black text-white">{error}</div>;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col">
      {/* Top UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto">
          <Link to={`/site/${id}`} className="bg-black/50 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors text-white w-12 h-12 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`backdrop-blur-md p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center ${showInfo ? 'bg-heritage-cyan text-black' : 'bg-black/50 hover:bg-white/20 text-white'}`}
          >
            <Info className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button className="bg-heritage-gold/20 backdrop-blur-md p-3 rounded-full hover:bg-heritage-gold transition-colors text-heritage-gold hover:text-black w-12 h-12 flex items-center justify-center">
            <PlayCircle className="w-6 h-6" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="bg-black/50 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors text-white w-12 h-12 flex items-center justify-center hidden md:flex"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Info Panel Overlay */}
      <div className={`absolute left-6 md:left-24 top-24 bottom-24 w-80 max-w-[calc(100vw-3rem)] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-10 transition-all duration-500 overflow-y-auto ${showInfo ? 'translate-x-0 opacity-100' : '-translate-x-[150%] opacity-0'}`}>
        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-heritage-cyan mb-4 border border-heritage-cyan/20">
          DIGITAL TWIN EXPLORER
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">{site.name}</h2>
        <p className="text-sm text-gray-400 mb-6 flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-heritage-gold" /> {site.location}
        </p>

        <div className="bg-heritage-navy/50 p-4 rounded-xl border border-white/5 mb-6">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1 text-amber-500" /> Condition: {site.preservationStatus}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            This digital reconstruction allows you to explore the site safely while it undergoes structural assessment. Physical access is currently restricted to prevent further deterioration.
          </p>
        </div>

        <h3 className="text-sm font-bold text-white mb-3">Controls</h3>
        <ul className="text-xs text-gray-400 space-y-2 mb-8">
          <li>• Left Click + Drag to rotate camera</li>
          <li>• Right Click + Drag to pan</li>
          <li>• Scroll to zoom in/out</li>
        </ul>

        <Link to="/adopt" className="btn-gold w-full flex justify-center py-3 text-sm">
          <Heart className="w-4 h-4 mr-2" /> Adopt a Stone
        </Link>
      </div>

      {/* 3D Canvas */}
      <div className="flex-grow w-full h-full cursor-move">
        <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
          <color attach="background" args={['#050814']} />
          <fog attach="fog" args={['#050814', 10, 40]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#00d4ff" />

          <Suspense fallback={null}>
            <MonumentPlaceholder siteName={site.name} />
            <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={20} blur={2} far={10} />
            <Environment preset="night" />
          </Suspense>

          <OrbitControls 
            makeDefault 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={4}
            maxDistance={25}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
      
      {/* WebXR Badge */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-heritage-cyan/30 px-4 py-2 rounded-lg flex items-center">
          <span className="w-2 h-2 rounded-full bg-heritage-cyan animate-pulse mr-2"></span>
          <span className="text-xs font-mono text-heritage-cyan">WebXR Ready</span>
        </div>
      </div>
    </div>
  );
}
