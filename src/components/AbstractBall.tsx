import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AbstractBall: React.FC<any> = (props) => {
  const {
    perlinTime = 25.0,
    perlinMorph = 25.0,
    perlinDNoise = 0.0,
    chromaRGBr = 7.5,
    chromaRGBg = 5.0,
    chromaRGBb = 7.0,
    chromaRGBn = 1.0,
    chromaRGBm = 1.0,
    sphereWireframe = false,
    spherePoints = false,
    spherePsize = 1.0,
    cameraSpeedY = 0.0,
    cameraSpeedX = 0.0,
    cameraZoom = 150,
    cameraGuide = false,
  } = props;

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const pointRef = useRef<THREE.Points | null>(null);
  const uniformsRef = useRef<any>({
    time: { value: 0.0 },
    RGBr: { value: chromaRGBr / 10 },
    RGBg: { value: chromaRGBg / 10 },
    RGBb: { value: chromaRGBb / 10 },
    RGBn: { value: chromaRGBn / 100 },
    RGBm: { value: chromaRGBm },
    morph: { value: perlinMorph },
    dnoise: { value: perlinDNoise },
    psize: { value: spherePsize }
  });

  const vertexShader = `
    uniform float time;
    uniform float morph;
    uniform float dnoise;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vNormal = normal;
      vPosition = position;
      
      vec3 pos = position;
      float noise = snoise(pos * 0.02 + time * 0.005) * morph;
      pos += normal * noise;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 2.0;
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float RGBr;
    uniform float RGBg;
    uniform float RGBb;
    uniform float RGBn;
    uniform float RGBm;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 color = vec3(RGBr, RGBg, RGBb);
      float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), RGBm);
      color = color * intensity + vec3(RGBn);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
    camera.position.set(0, 10, cameraZoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(20, 20);

    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      wireframe: sphereWireframe,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    const point = new THREE.Points(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
    scene.add(point);

    const animate = () => {
      uniformsRef.current.time.value += perlinTime / 10000;
      uniformsRef.current.morph.value = perlinMorph;
      uniformsRef.current.dnoise.value = perlinDNoise;

      uniformsRef.current.RGBr.value = chromaRGBr / 10;
      uniformsRef.current.RGBg.value = chromaRGBg / 10;
      uniformsRef.current.RGBb.value = chromaRGBb / 10;
      uniformsRef.current.RGBn.value = chromaRGBn / 100;
      uniformsRef.current.RGBm.value = chromaRGBm;
      uniformsRef.current.psize.value = spherePsize;

      mesh.rotation.y += cameraSpeedY / 100;
      mesh.rotation.z += cameraSpeedX / 100;
      point.rotation.y = mesh.rotation.y;
      point.rotation.z = mesh.rotation.z;

      material.wireframe = sphereWireframe;
      mesh.visible = !spherePoints;
      point.visible = spherePoints;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    materialRef.current = material;
    meshRef.current = mesh;
    pointRef.current = point;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [perlinTime, perlinMorph, perlinDNoise, chromaRGBr, chromaRGBg, chromaRGBb, chromaRGBn, chromaRGBm, sphereWireframe, spherePoints, spherePsize, cameraSpeedY, cameraSpeedX, cameraZoom]);

  useEffect(() => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        duration: 2,
        z: 300 - cameraZoom
      });
    }
    gsap.to(uniformsRef.current.RGBr, { duration: 1, value: Math.random() * 10 });
    gsap.to(uniformsRef.current.RGBg, { duration: 1, value: Math.random() * 10 });
    gsap.to(uniformsRef.current.RGBb, { duration: 1, value: Math.random() * 10 });
    gsap.to(uniformsRef.current.RGBn, { duration: 1, value: Math.random() * 2 });
    gsap.to(uniformsRef.current.RGBm, { duration: 1, value: Math.random() * 5 });
  }, [cameraZoom]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%' }} className="rounded-2xl" />
  );
};

export default AbstractBall;