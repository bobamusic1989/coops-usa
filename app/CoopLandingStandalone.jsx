import React, { useMemo, useRef, useState, useEffect } from "react";

export default function CoopLandingStandalone() {
  const [wood, setWood] = useState("cedar");
  const [roof, setRoof] = useState("lean-to");
  const [roofMat, setRoofMat] = useState("metal");
  const [levels, setLevels] = useState(2);
  const [timedDoor, setTimedDoor] = useState(true);
  const [lengthFt, setLengthFt] = useState(8);
  const [hardware, setHardware] = useState("black");

  const colors = useMemo(
    () =>
      wood === "cedar"
        ? { base: "#B7773A", mid: "#9C5F24", dark: "#6E3F16" }
        : { base: "#D6C5A8", mid: "#C4B090", dark: "#A08D73" },
    [wood]
  );
  const meshStroke = hardware === "black" ? "#0a0a0a" : "#9ca3af";

  function estimatePrice(w, r, h, len, levels, roofMat, timedDoor) {
    const base = 3200;
    const perFoot = w === "cedar" ? 280 : 220;
    const roofAdj = r === "gable" ? 350 : 180;
    const hardwareAdj = h === "black" ? 120 : 0;
    const levelAdj = levels === 2 ? 350 : 0;
    const roofMatAdj = roofMat === "metal" ? 220 : 0;
    const timedDoorAdj = timedDoor ? 180 : 0;
    return Math.round(base + perFoot * len + roofAdj + hardwareAdj + levelAdj + roofMatAdj + timedDoorAdj);
  }
  const price = useMemo(
    () => estimatePrice(wood, roof, hardware, lengthFt, levels, roofMat, timedDoor),
    [wood, roof, hardware, lengthFt, levels, roofMat, timedDoor]
  );

  // simple tilt effect
  const cardRef = useRef(null);
  function onPointerMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 8}deg)`;
  }
  function onPointerLeave() {
    const el = cardRef.current;
    if (el) el.style.transform = "rotateY(0) rotateX(0)";
  }

  return (
    <main style={styles.main}>
      <style>{css}</style>
      <section id="build" className="section">
        <div className="wrap grid hero" style={{ padding: "56px 20px 72px" }}>
          <div>
            <h1 className="h1">Hand‑Built <span style={{ color: "var(--brand)" }}>Chicken Coops</span></h1>
            <p className="muted">Cedar & Pine • Predator‑proof • Custom dimensions.</p>
            {/* controls omitted for brevity – keep your existing controls here */}
            <div className="price">
              <span className="muted" style={{ fontSize: 13 }}>Visual estimate</span>
              <strong style={{ fontSize: 24 }}>{`$${price.toLocaleString()}`}</strong>
            </div>
          </div>

          <div className="visual">
            <div ref={cardRef} className="card tile" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
              <div className="chip">Hand‑built</div>
              <div style={{ marginTop: 8 }}>
                <CoopSVG
                  woodColors={colors}
                  meshStroke={meshStroke}
                  roof={roof}
                  roofMat={roofMat}
                  lengthFt={lengthFt}
                  levels={levels}
                  timedDoor={timedDoor}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CoopSVG({ woodColors, meshStroke, roof, roofMat, lengthFt, levels, timedDoor }) {
  const unit = 20;
  const L = Math.max(4, Math.min(16, lengthFt)) * unit;
  const H = 6 * unit;
  const depth = 4 * unit;
  const isoX = 0.9, isoY = 0.5;
  const sox = depth * isoX, soy = depth * isoY;
  const ridge = roof === "gable" ? unit * 1.6 : unit * 1.0;
  const eave = unit * 0.5;

  function shade(hex, amt) {
    const x = hex.slice(1);
    const r = parseInt(x.substr(0, 2), 16);
    const g = parseInt(x.substr(2, 2), 16);
    const b = parseInt(x.substr(4, 2), 16);
    const t = v => Math.max(0, Math.min(255, Math.round(v + 255 * amt)));
    return "#" + t(r).toString(16).padStart(2, "0") + t(g).toString(16).padStart(2, "0") + t(b).toString(16).padStart(2, "0");
  }

  return (
    <svg viewBox={`${-sox * 0.45 - eave} ${-(ridge + soy + 30)} ${L + sox * 1.35} ${H + ridge + soy + 70}`} style={{ width: "100%", height: "auto" }}>
      {/* ground shadow */}
      <ellipse cx={L * 0.55} cy={H + soy + 26} rx={L * 0.45} ry={20} fill="black" opacity="0.3" />
      {/* lean‑to metal roof */}
      <polygon
        points={`${-eave},-${ridge} ${L + eave},0 ${L + sox},${soy} ${sox},${soy - ridge}`}
        fill={roofMat === "metal" ? "#BBC4D6" : shade(woodColors.mid, -0.2)}
        stroke={roofMat === "metal" ? "#6B7280" : woodColors.dark}
        strokeWidth="2"
      />
      {/* side/back wall */}
      <polygon
        points={`${L},0 ${L + sox},${soy} ${L + sox},${H + soy} ${L},${H}`}
        fill={shade(woodColors.base, -0.1)}
        stroke={shade(woodColors.dark, -0.3)}
        strokeWidth="2"
      />
      {/* front face */}
      <rect x="0" y="0" width={L} height={H} fill={woodColors.base} stroke={woodColors.dark} strokeWidth="2" />
      <rect x="0" y="0" width={L} height={H} fill="none" stroke={woodColors.dark} strokeOpacity="0.1" strokeWidth="2" />
      {/* bottom run area with mesh */}
      <rect x="0" y={H * 0.35} width={L} height={H * 0.45} fill="#f4f4f5" stroke={woodColors.dark} strokeWidth="2" />
      <rect x="0" y={H * 0.35} width={L} height={H * 0.45} fill="none" stroke={meshStroke} strokeWidth="2" />
      <pattern id="meshPat" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 0 L8 0 M0 0 L0 8" stroke={meshStroke} strokeWidth="1" />
        <path d="M8 0 L8 8 M0 8 L8 8" stroke={meshStroke} strokeWidth="1" opacity="0.35" />
      </pattern>
      <rect x="0" y={H * 0.35} width={L} height={H * 0.45} fill="url(#meshPat)" />
      {/* electronic door */}
      <rect x={L - unit * 2.8} y={H * 0.45} width={unit * 2.6} height={unit * 3.2} fill="#0B0B0C" stroke="#6B7280" strokeWidth="2" />
      {/* upper roost area */}
      {levels === 2 && (
        <>
          <rect
            x={L * 0.4}
            y={H * 0.1}
            width={L * 0.55}
            height={H * 0.25}
            fill={shade(woodColors.base, -0.05)}
            stroke={woodColors.dark}
            strokeWidth="2"
          />
          {/* arch opening */}
          <path
            d={`
              M ${L * 0.7} ${H * 0.1}
              L ${L * 0.85} ${H * 0.1}
              A ${L * 0.075} ${H * 0.125} 0 0 1 ${L * 0.85} ${H * 0.35}
              L ${L * 0.7} ${H * 0.35} Z
            `}
            fill={shade(woodColors.mid, -0.1)}
            stroke={woodColors.dark}
            strokeWidth="2"
          />
          {/* ladder up to roost */}
          <line x1={L * 0.2} y1={H * 0.35} x2={L * 0.65} y2={H * 0.12} stroke={woodColors.dark} strokeWidth="4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={L * 0.2 + (L * 0.45) * (i / 5)}
              y1={H * 0.35 - (H * 0.23) * (i / 5)}
              x2={L * 0.25 + (L * 0.45) * (i / 5)}
              y2={H * 0.32 - (H * 0.23) * (i / 5)}
              stroke={woodColors.dark}
              strokeWidth="4"
            />
          ))}
        </>
      )}
      {/* clean-out box on left? (optional) */}
    </svg>
  );
}

/* retain your CSS styles… */
const css = `
/* your existing Tailwind-like CSS omitted for brevity */
`;

const styles = {
  main: {
    minHeight: "100vh",
    background: "#0b0b0c",
    color: "#f4f4f5",
    fontFamily: "ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial",
  },
};
