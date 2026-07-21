'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function generateNoiseDataURL(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(128, 128);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export default function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);
  const gainRef = useRef<GainNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMutedState] = useState(true);
  const mutedRef = useRef(true);

  const setMuted = useCallback((val: boolean) => {
    mutedRef.current = val;
    setMutedState(val);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    const gain = gainRef.current;

    if (muted) {
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (video) video.muted = false;
      if (gain) gain.gain.value = 0.5;
      setMuted(false);
    } else {
      if (video) video.muted = true;
      if (gain) gain.gain.value = 0;
      setMuted(true);
    }
  }, [muted, setMuted]);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = videoWrapRef.current;
    const overlay = blackOverlayRef.current;
    const grain = grainRef.current;
    if (!video || !wrap || !overlay) return;

    if (grain) {
      grain.style.backgroundImage = `url(${generateNoiseDataURL()})`;
    }

    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      video.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    };

    window.addEventListener('mousemove', handleMouse);

    const tryResume = () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    };

    document.addEventListener('pointerdown', tryResume, { once: true });
    document.addEventListener('scroll', tryResume, { once: true });

    const initAudio = () => {
      try {
        if (ctxRef.current) return;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        ctxRef.current = audioCtx;
        const source = audioCtx.createMediaElementSource(video);
        const gain = audioCtx.createGain();
        gain.gain.value = mutedRef.current ? 0 : 0.5;
        source.connect(gain);
        gain.connect(audioCtx.destination);
        gainRef.current = gain;
      } catch {
        // audio not supported
      }
    };

    if (video.readyState >= 2) {
      initAudio();
    } else {
      video.addEventListener('loadedmetadata', initAudio, { once: true });
    }

    ScrollTrigger.refresh();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1.5,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      wrap,
      { scale: 1 },
      { scale: 1.6, ease: 'power2.inOut' },
      0,
    )
      .fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut' },
        0,
      )
      .to(
        { v: 0.5 },
        {
          v: 0,
          ease: 'power2.inOut',
          onUpdate() {
            const gain = gainRef.current;
            if (gain && !mutedRef.current) gain.gain.value = this.targets()[0].v;
          },
        },
        0,
      );

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('pointerdown', tryResume);
      document.removeEventListener('scroll', tryResume);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <div
        ref={videoWrapRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          transformOrigin: 'center center',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.15s ease-out',
            willChange: 'transform',
          }}
        >
          <source src="/videos/knight.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <div
        ref={grainRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.15,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          mixBlendMode: 'overlay',
        }}
      />

      <div
        ref={blackOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: '#000',
          opacity: 0,
        }}
      />

      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          zIndex: 10,
          width: 48,
          height: 48,
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: 'mutePulse 3s ease-in-out infinite',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
        }}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <style>{`
        @keyframes mutePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }
      `}</style>
    </section>
  );
}
