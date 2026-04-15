import "./EctoplasmDrips.css";

export function EctoplasmDrips() {
  return (
    <div className="ecto-layer" aria-hidden>
      <svg
        className="ecto-svg"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ectoGradA" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(120, 255, 160, 0.95)" />
            <stop offset="55%" stopColor="rgba(30, 180, 90, 0.75)" />
            <stop offset="100%" stopColor="rgba(10, 90, 40, 0.35)" />
          </linearGradient>
          <linearGradient id="ectoGradB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(180, 255, 120, 0.9)" />
            <stop offset="100%" stopColor="rgba(20, 140, 70, 0.5)" />
          </linearGradient>
        </defs>
        <path
          className="ecto-drip ecto-drip--1"
          fill="url(#ectoGradA)"
          d="M0,40 Q120,0 240,45 T480,35 T720,50 T960,30 T1200,55 L1200,0 L0,0 Z"
        />
        <path
          className="ecto-drip ecto-drip--2"
          fill="url(#ectoGradB)"
          d="M0,55 Q200,90 400,50 T800,70 T1200,45 L1200,0 L0,0 Z"
          opacity="0.65"
        />
        <path
          className="ecto-drip ecto-drip--3"
          fill="rgba(90, 255, 150, 0.55)"
          d="M0,70 Q300,20 600,80 T1200,60 L1200,0 L0,0 Z"
        />
        <ellipse cx="180" cy="120" rx="22" ry="95" fill="rgba(50, 220, 110, 0.45)" />
        <ellipse cx="420" cy="140" rx="18" ry="120" fill="rgba(40, 200, 100, 0.4)" />
        <ellipse cx="760" cy="110" rx="26" ry="105" fill="rgba(70, 255, 140, 0.38)" />
        <ellipse cx="980" cy="130" rx="20" ry="118" fill="rgba(30, 170, 85, 0.42)" />
      </svg>
    </div>
  );
}
