'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Stethoscope,
  Target,
  Eye,
  Globe,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';

// 3D Campus Model Component
function Campus3DViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState(0.5);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001122);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.set(30, 20, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x1a5d1a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Building creation function
    const createBuilding = (x: number, z: number, width: number, height: number, depth: number, color: number, label: string) => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshLambertMaterial({ color });
      const building = new THREE.Mesh(geometry, material);
      building.position.set(x, height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData = { label, type: 'building' };
      scene.add(building);

      // Building label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#ffffff';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(label, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, height + 2, z);
      sprite.scale.set(8, 2, 1);
      scene.add(sprite);

      return building;
    };

    // Create campus buildings
    createBuilding(0, 0, 8, 4, 6, 0x1976d2, 'Academic Center');
    createBuilding(-15, -10, 10, 6, 8, 0x7b1fa2, 'Dormitory');
    createBuilding(15, -5, 6, 4, 5, 0xd32f2f, 'Medical Clinic');
    createBuilding(-8, 15, 12, 5, 10, 0xf57c00, 'Training Center');
    createBuilding(12, 15, 8, 4, 6, 0x388e3c, 'Recovery Center');
    createBuilding(8, 0, 5, 4, 4, 0x5e35b1, 'VR Labs');
    createBuilding(-8, 0, 6, 3, 5, 0x00796b, 'Nutrition Center');
    createBuilding(0, -15, 6, 4, 4, 0x424242, 'Administration');

    // Sports fields
    const createField = (x: number, z: number, width: number, depth: number, color: number) => {
      const fieldGeometry = new THREE.PlaneGeometry(width, depth);
      const fieldMaterial = new THREE.MeshLambertMaterial({ color });
      const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
      field.rotation.x = -Math.PI / 2;
      field.position.set(x, -0.5, z);
      scene.add(field);
    };

    createField(-25, 0, 12, 8, 0x2d7d32); // Football field
    createField(-25, 15, 10, 6, 0x8d6e63); // Basketball court
    createField(25, 0, 8, 6, 0x1976d2); // Tennis court
    createField(25, 15, 15, 10, 0xd32f2f); // Track

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Mouse controls
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onWheel = (event: WheelEvent) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
      const distance = camera.position.length();
      if (distance < 10) camera.position.setLength(10);
      if (distance > 100) camera.position.setLength(100);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 4D time animation
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setTimeOfDay((prev) => (prev + 0.01) % 1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Update lighting based on time of day
  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.DirectionalLight) {
        const intensity = Math.sin(timeOfDay * Math.PI) * 0.8 + 0.2;
        object.intensity = Math.max(0.1, intensity);
        
        if (timeOfDay < 0.3) {
          object.color.setHex(0x4a90e2); // Morning blue
        } else if (timeOfDay < 0.7) {
          object.color.setHex(0xffffff); // Midday white
        } else {
          object.color.setHex(0xff6b35); // Evening orange
        }
      }
    });
  }, [timeOfDay]);

  return (
    <div className="space-y-6">
      {/* 3D Viewport */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Interactive 3D Campus Model</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAnimating ? 'Pause' : 'Animate'}
              </Button>
            </div>
          </div>
          {isAnimating && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Time:</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-400 min-w-[60px]">
                {Math.floor(timeOfDay * 24).toString().padStart(2, '0')}:00
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div 
            ref={mountRef} 
            className="w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden"
            style={{ cursor: 'grab' }}
          />
          <div className="mt-4 text-sm text-gray-400">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Controls:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Left click + drag: Rotate view</li>
                  <li>• Scroll wheel: Zoom in/out</li>
                </ul>
              </div>
              <div>
                <strong>4D Features:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Time slider: Change time of day</li>
                  <li>• Animate: Watch 24-hour cycle</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campus Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-300">$95M</div>
            <div className="text-sm text-gray-400">Total Investment</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-300">800</div>
            <div className="text-sm text-gray-400">Student Capacity</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-purple-300">8</div>
            <div className="text-sm text-gray-400">Major Buildings</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-300">24</div>
            <div className="text-sm text-gray-400">Month Timeline</div>
          </CardContent>
        </Card>
      </div>

      {/* Building Legend */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Campus Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-300">Academic Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-gray-300">Dormitory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-300">Medical Clinic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-300">Training Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-300">Recovery Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span className="text-gray-300">VR Labs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span className="text-gray-300">Nutrition Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-gray-300">Administration</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Campus3DModel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4 mb-8">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2">
            3D/4D Campus Visualization
          </Badge>
          <h1 className="text-4xl font-bold text-white">Go4it Sports Academy Campus</h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Explore our $95M elite athletic campus in immersive 3D with 4D time visualization
          </p>
        </div>
        
        <Campus3DViewer />
      </div>
    </div>
  );
}