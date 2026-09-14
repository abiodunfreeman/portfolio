import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Point3D = { x: number; y: number; z: number };
type Wire = { points: Point3D[]; kind: 'strand' | 'ring'; emphasis: number };
type ProjectedPoint = Point3D & { scale: number };

const TAU = Math.PI * 2;
const STRANDS = 32;
const STEPS = 84;
const RINGS = 24;

function normalize(point: Point3D): Point3D {
  const length = Math.hypot(point.x, point.y, point.z);

  return { x: point.x / length, y: point.y / length, z: point.z / length };
}

function cross(a: Point3D, b: Point3D): Point3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

// A trefoil centerline gives the sculpture its three interlocking lobes.
function centerline(u: number): Point3D {
  const radius = 1.04 + 0.37 * Math.cos(3 * u);

  return {
    x: radius * Math.cos(2 * u),
    y: radius * Math.sin(2 * u),
    z: 0.48 * Math.sin(3 * u),
  };
}

function surfacePoint(u: number, v: number): Point3D {
  const center = centerline(u);
  const next = centerline(u + 0.001);
  const tangent = normalize({
    x: next.x - center.x,
    y: next.y - center.y,
    z: next.z - center.z,
  });
  const normal = normalize(cross(tangent, { x: 0, y: 0, z: 1 }));
  const binormal = cross(tangent, normal);
  const twist = v + u * 2;
  const tubeRadius = 0.255 + 0.035 * Math.sin(3 * u + 0.6);
  const across = Math.cos(twist) * tubeRadius;
  const around = Math.sin(twist) * tubeRadius;

  return {
    x: center.x + normal.x * across + binormal.x * around,
    y: center.y + normal.y * across + binormal.y * around,
    z: center.z + normal.z * across + binormal.z * around,
  };
}

function createWires(): Wire[] {
  const wires: Wire[] = [];

  // Four sections per strand allow depth ordering without thousands of strokes.
  for (let strand = 0; strand < STRANDS; strand += 1) {
    for (let section = 0; section < 4; section += 1) {
      const points: Point3D[] = [];
      const firstStep = (section * STEPS) / 4;
      const lastStep = ((section + 1) * STEPS) / 4;

      for (let step = firstStep; step <= lastStep; step += 1) {
        points.push(surfacePoint((step / STEPS) * TAU, (strand / STRANDS) * TAU));
      }

      wires.push({
        points,
        kind: 'strand',
        emphasis: strand % 8 === 0 ? 1 : 0,
      });
    }
  }

  for (let ring = 0; ring < RINGS; ring += 1) {
    const points: Point3D[] = [];

    for (let step = 0; step <= 16; step += 1) {
      points.push(surfacePoint((ring / RINGS) * TAU, (step / 16) * TAU));
    }

    wires.push({ points, kind: 'ring', emphasis: 0 });
  }

  return wires;
}

const WIRES = createWires();

export function OrbitSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sculptureRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setIsPlaying(!preference.matches);

    preference.addEventListener('change', updatePreference);

    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sculpture = sculptureRef.current;

    if (!canvas || !sculpture) return;

    const context = canvas.getContext('2d', { alpha: true });

    if (!context) return;

    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let lastTime = 0;
    let onScreen = true;
    let pointerX = 0;
    let pointerY = 0;
    let easedPointerX = 0;
    let easedPointerY = 0;

    function draw() {
      if (!context) return;

      context.clearRect(0, 0, width, height);

      const phase = rotationRef.current;
      const angleX = 0.47 + Math.sin(phase * 0.8) * 0.13 + easedPointerY * 0.15;
      const angleY = -0.3 + Math.sin(phase * 0.65) * 0.2 + easedPointerX * 0.18;
      const angleZ = -0.49 + phase * 0.16;
      const size = Math.min(width, height) * 0.267;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      function project(point: Point3D): ProjectedPoint {
        const y1 = point.y * cosX - point.z * sinX;
        const z1 = point.y * sinX + point.z * cosX;
        const x2 = point.x * cosY + z1 * sinY;
        const z2 = -point.x * sinY + z1 * cosY;
        const x3 = x2 * cosZ - y1 * sinZ;
        const y3 = x2 * sinZ + y1 * cosZ;
        const perspective = 4.5 / (4.5 - z2);

        return {
          x: width * 0.5 + x3 * size * perspective,
          y: height * 0.49 + y3 * size * perspective,
          z: z2,
          scale: perspective,
        };
      }

      const projectedWires = WIRES.map((wire) => {
        const points = wire.points.map(project);
        const depth = points.reduce((sum, point) => sum + point.z, 0) / points.length;

        return { ...wire, points, depth };
      }).sort((a, b) => a.depth - b.depth);

      context.lineJoin = 'round';
      context.lineCap = 'round';

      for (const wire of projectedWires) {
        const light = Math.max(0, Math.min(1, (wire.depth + 1.1) / 2.2));
        const isRing = wire.kind === 'ring';
        const opacity = isRing ? 0.08 + light * 0.17 : 0.22 + light * 0.66;
        const luminance = 24 + light * 42 + wire.emphasis * 9;

        context.strokeStyle = `hsla(${14 + light * 17}, 100%, ${luminance}%, ${opacity})`;
        context.lineWidth = isRing
          ? 0.45
          : (0.58 + light * 0.7 + wire.emphasis * 0.2) * Math.min(1.3, width / 500);
        context.beginPath();

        wire.points.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });

        context.stroke();
      }
    }

    function tick(time: number) {
      animationFrame = 0;

      if (!isPlaying || !onScreen || document.hidden) return;

      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      rotationRef.current += delta * 0.19;
      const easing = 1 - Math.exp(-delta * 3);
      easedPointerX += (pointerX - easedPointerX) * easing;
      easedPointerY += (pointerY - easedPointerY) * easing;
      draw();
      animationFrame = window.requestAnimationFrame(tick);
    }

    function syncAnimation() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastTime = 0;

      if (isPlaying && onScreen && !document.hidden) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    function resize() {
      if (!canvas || !sculpture || !context) return;

      const bounds = sculpture.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    }

    function movePointer(event: PointerEvent) {
      if (!isPlaying || !sculpture) return;

      const bounds = sculpture.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2;
    }

    function resetPointer() {
      pointerX = 0;
      pointerY = 0;
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        syncAnimation();
      },
      { threshold: 0 },
    );

    resizeObserver.observe(sculpture);
    intersectionObserver.observe(sculpture);
    sculpture.addEventListener('pointermove', movePointer, { passive: true });
    sculpture.addEventListener('pointerleave', resetPointer, { passive: true });
    document.addEventListener('visibilitychange', syncAnimation);
    resize();
    syncAnimation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      sculpture.removeEventListener('pointermove', movePointer);
      sculpture.removeEventListener('pointerleave', resetPointer);
      document.removeEventListener('visibilitychange', syncAnimation);
    };
  }, [isPlaying]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={sculptureRef}
        role="img"
        aria-label="An orange wire sculpture with three interlocking, gently rotating loops"
        className="absolute inset-0"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
      </div>
      <button
        type="button"
        onClick={() => setIsPlaying((playing) => !playing)}
        aria-label={isPlaying ? 'Pause sculpture animation' : 'Play sculpture animation'}
        className="absolute right-5 bottom-5 z-10 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/65 backdrop-blur-sm transition-colors hover:border-orange-400/60 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
      >
        {isPlaying ? (
          <Pause size={13} aria-hidden="true" />
        ) : (
          <Play size={13} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
