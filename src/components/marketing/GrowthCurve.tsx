// Signature hero element: a self-drawing growth curve with live-feeling
// metric chips, embodying "Turn Attention Into Growth" without resorting
// to a generic stat-grid template.
export default function GrowthCurve() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
      <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Rising growth curve illustration">
        <defs>
          <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f8bff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f8bff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4f8bff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[60, 110, 160, 210, 260].map((y) => (
          <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="white" strokeOpacity="0.05" />
        ))}

        <path
          d="M20,260 C90,250 110,180 150,170 C190,160 210,220 250,190 C290,160 300,60 380,30"
          fill="none"
          stroke="url(#curveStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          className="curve-draw"
        />
        <path
          d="M20,260 C90,250 110,180 150,170 C190,160 210,220 250,190 C290,160 300,60 380,30 L380,290 L20,290 Z"
          fill="url(#curveFill)"
        />
        <circle cx="380" cy="30" r="5" fill="#a78bfa" className="curve-dot" />
      </svg>

      <div className="absolute left-2 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-electric-400" /> Attention captured
      </div>
      <div className="absolute bottom-6 right-2 flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> Revenue growing
      </div>

      <style>{`
        .curve-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw 2.2s ease-out forwards;
        }
        .curve-dot {
          opacity: 0;
          animation: dotIn 0.6s ease-out 2s forwards, pulse 2s ease-in-out 2.6s infinite;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes dotIn { to { opacity: 1; } }
        @keyframes pulse {
          0%, 100% { r: 5; opacity: 1; }
          50% { r: 7; opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .curve-draw { stroke-dashoffset: 0; animation: none; }
          .curve-dot { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  );
}
