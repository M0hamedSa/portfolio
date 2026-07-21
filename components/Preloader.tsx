'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';

function Model3D({ onReady }: { onReady: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let destroyed = false;

    (async () => {
      const mod = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

      const scene = new mod.Scene();

      const camera = new mod.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(2.5, 1.5, 4);
      camera.lookAt(0, 0, 0);

      const renderer = new mod.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(280, 280);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = mod.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      el.appendChild(renderer.domElement);

      const ambient = new mod.AmbientLight(0xffffff, 0.7);
      scene.add(ambient);

      const key = new mod.DirectionalLight(0xffffff, 2.5);
      key.position.set(5, 8, 5);
      scene.add(key);

      const fill = new mod.DirectionalLight(0xffffff, 0.8);
      fill.position.set(-3, 1, -3);
      scene.add(fill);

      const rim = new mod.DirectionalLight(0xffffff, 1);
      rim.position.set(0, -3, -5);
      scene.add(rim);

      let model: import('three').Object3D | null = null;
      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync('/3d/chess_king_2.glb');
        model = gltf.scene;
        model.scale.set(1.6, 1.6, 1.6);
        scene.add(model);
      } catch {
        // model failed to load — render nothing
      }

      onReady();

      const animate = () => {
        if (destroyed) return;
        requestAnimationFrame(animate);
        if (model) model.rotation.y += 0.008;
        renderer.render(scene, camera);
      };
      animate();

      cleanupRef.current = () => {
        destroyed = true;
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    })();

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        bottom: 30,
        left: 30,
        width: 280,
        height: 280,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const frameRef = useRef(0);
  const startRef = useRef(0);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const MIN_DURATION = 3000;
  const MESSAGES = [
    'FRAGMENT FOUND',
    'AWAKENING THE CORE',
    'RESTORING LOST DATA',
    'FORGING DIGITAL REALITY',
    'THE JOURNEY BEGINS',
  ];

  const begin = useCallback(() => {
    setStarted(true);
    startRef.current = Date.now();
    frameRef.current = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - startRef.current;
      const raw = Math.min(elapsed / MIN_DURATION, 1);
      setProgress(raw);
      if (raw < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 2.4,
          ease: 'power2.inOut',
          onStart: () => {
            if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
          },
          onComplete: () => setVisible(false),
        });
      }
    });
  }, []);

  const onModelReady = useCallback(() => {
    setModelReady(true);
  }, []);

  useEffect(() => {
    if (modelReady && videoReady) begin();
  }, [modelReady, videoReady, begin]);

  useEffect(() => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = '/videos/knight.mp4';
    video.muted = true;
    const onCanPlay = () => setVideoReady(true);
    video.addEventListener('canplaythrough', onCanPlay, { once: true });
    video.load();
    return () => {
      video.removeEventListener('canplaythrough', onCanPlay);
      video.remove();
    };
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (!started) return;
    const el = textRef.current;
    if (!el) return;

    const perItem = 0.5;
    const tl = gsap.timeline({ paused: true });
    MESSAGES.forEach((msg, i) => {
      if (i > 0) {
        tl.to(el, { opacity: 0, duration: 0.1, ease: 'power2.in' });
      }
      tl.call(() => { el.textContent = msg; });
      tl.to(el, { opacity: 1, duration: 0.16, ease: 'power2.out' });
      tl.to(el, { duration: perItem - 0.26 });
    });
    tl.play();
    return () => { tl.kill(); };
  }, [started]);

  if (!visible) return null;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap');`}</style>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}
      >
        <Model3D onReady={onModelReady} />

        <div
          ref={textRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            color: '#fff',
            letterSpacing: 6,
            opacity: 0,
          }}
        >
          FRAGMENT FOUND
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            width: '80%',
            maxWidth: 800,
            height: 2,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: '#fff',
              borderRadius: 1,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </>
  );
}
