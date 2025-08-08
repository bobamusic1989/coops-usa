import React, { useMemo, useRef, useState, useEffect } from "react";

export default function CoopLandingStandalone() {
  // STATE
  const [wood, setWood] = useState("cedar");         // "cedar" | "pine"
  const [roof, setRoof] = useState("gable");         // "gable" | "lean-to"
  const [roofMat, setRoofMat] = useState("metal");   // "wood" | "metal"
  const [levels, setLevels] = useState(2);           // 1 | 2  (2 = partial loft + ladder)
  const [timedDoor, setTimedDoor] = useState(false); // auto/timed door
  const [lengthFt, setLengthFt] = useState(11);      // 4..16
  const [hardware, setHardware] = useState("black"); // "black" | "galvanized"

  const colors = useMemo(
    () =>
      wood === "cedar"
        ? { base: "#B7773A", mid: "#9C5F24", dark: "#6E3F16" }
        : { base: "#D6C5A8", mid: "#C4B090", dark: "#A08D73" },
    [wood]
  );
  const meshStroke = hardware === "black" ? "#0a0a0a" : "#9ca3af";

  // PRICE ESTIMATOR
  function estimatePrice(w, r, h, len, levels, roofMat, timedDoor) {
    const base = 3200;
    const perFoot = w === "cedar" ? 280 : 220;
    const roofAdj = r === "gable" ? 350 : 180;
    const hardwareAdj = h === "black" ? 120 : 0;
    const levelAdj = levels === 2 ? 350 : 0;          // loft + ladder
    const roofMatAdj = roofMat === "metal" ? 220 : 0; // sheet metal upcharge
    const timedDoorAdj = timedDoor ? 180 : 0;         // controller + install
    return Math.round(
      base + perFoot * len + roofAdj + hardwareAdj + levelAdj + roofMatAdj + timedDoorAdj
    );
  }
  const price = useMemo(
    () => estimatePrice(wood, roof, hardware, lengthFt, levels, roofMat, timedDoor),
    [wood, roof, hardware, lengthFt, levels, roofMat, timedDoor]
  );

  // tiny sanity
  useEffect(() => {
    try {
      console.assert(estimatePrice("cedar","gable","black",8,1,"wood",false) === 5910, "sanity ok");
    } catch {}
  }, []);

  // tilt
  const cardRef = useRef(null);
  function onPointerMove(e) {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 8}deg)`;
  }
  function onPointerLeave() { const el = cardRef.current; if (el) el.style.transform = "rotateY(0) rotateX(0)"; }

  return (
    <main style={styles.main}>
      <style>{css}</style>

      <header className="top">
        <div className="wrap bar">
          <div className="logo">
            <span className="badge" aria-hidden>
              <svg viewBox="0 0 48 48" width="24" height="24" role="img" aria-label="USA hand-built">
                <path d="M6 32h36M6 24h36M6 16h36" stroke="rgba(0,0,0,.55)" strokeWidth="2" />
                <path d="M9 18l8-8 8 8 8-8 7 7" fill="none" stroke="#0b0b0c" strokeWidth="3" />
              </svg>
            </span>
            <div>COOPS<span style={{color:"var(--brand)",margin:"0 .25rem"}}>/</span>USA</div>
          </div>
          <nav className="nav">
            <a href="#build">Build</a><a href="#proof">Proof</a><a href="#specs">Specs</a><a href="#quote">Quote</a>
          </nav>
          <a className="btn" href="#quote">Made in USA</a>
        </div>
      </header>

      <section id="build" className="section">
        <div className="wrap grid hero" style={{ padding: "56px 20px 72px" }}>
          {/* Controls */}
          <div>
            <h1 className="h1">Hand-Built <span style={{ color: "var(--brand)" }}>Chicken Coops</span></h1>
            <p className="muted" style={{ margin: "8px 0 0" }}>Cedar & Pine • Predator-proof • Custom dimensions.</p>

            <div className="controls" style={{ marginTop: 28, display: "grid", gap: 20 }}>
              <div>
                <label>Wood</label>
                <div className="row">
                  {["cedar","pine"].map(w=>(
                    <button key={w} type="button" onClick={()=>setWood(w)} className={"toggle"+(wood===w?" active":"")}>{w.toUpperCase()}</button>
                  ))}
                </div>
              </div>

              <div>
                <label>Roof</label>
                <div className="row">
                  {["gable","lean-to"].map(r=>(
                    <button key={r} type="button" onClick={()=>setRoof(r)} className={"toggle"+(roof===r?" active":"")}>{r.toUpperCase()}</button>
                  ))}
                </div>
              </div>

              <div>
                <label>Roof Material</label>
                <div className="row">
                  {["wood","metal"].map(m=>(
                    <button key={m} type="button" onClick={()=>setRoofMat(m)} className={"toggle"+(roofMat===m?" active":"")}>
                      {m==="metal"?"SHEET METAL":"WOOD"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Levels</label>
                <div className="row">
                  {[1,2].map(n=>(
                    <button key={n} type="button" onClick={()=>setLevels(n)} className={"toggle"+(levels===n?" active":"")}>
                      {n} LEVEL{n===1?"":"S"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Timed Door</label>
                <div className="row">
                  {[false,true].map(v=>(
                    <button key={v?"yes":"no"} type="button" onClick={()=>setTimedDoor(v)} className={"toggle"+(timedDoor===v?" active":"")}>
                      {v?"YES":"NO"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Length (coop + run)</label>
                <div className="row" style={{alignItems:"center"}}>
                  <input type="range" min={4} max={16} value={lengthFt} onChange={(e)=>setLengthFt(parseInt(e.target.value,10))}/>
                  <div style={{width:48,textAlign:"right",font:"600 14px ui-monospace,Menlo,Consolas,monospace"}}>{lengthFt}′</div>
                </div>
              </div>

              <div>
                <label>Hardware Finish</label>
                <div className="row">
                  {["black","galvanized"].map(h=>(
                    <button key={h} type="button" onClick={()=>setHardware(h)} className={"toggle"+(hardware===h?" active":"")}>{h.toUpperCase()}</button>
                  ))}
                </div>
              </div>

              <div className="price">
                <div className="muted" style={{fontSize:13}}>Visual estimate</div>
                <div style={{font:"700 26px/1.1 ui-sans-serif"}}>{`$${price.toLocaleString()}`}</div>
              </div>

              <div className="cta">
                <a href={mailtoQuote({ wood, roof, lengthFt, hardware, levels, roofMat, timedDoor })} className="primary">Request a Build</a>
                <a className="ghost" href="#specs">See Specs</a>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="visual">
            <div ref={cardRef} className="card tile" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
              <div className="chip"><span className="ic" />Hand-built</div>
              <div className="chip floating right">Predator-proof</div>
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

      {/* Proof */}
      <section id="proof" className="section">
        <div className="wrap" style={{ padding: "72px 20px" }}>
          <div className="grid cards">
            <ProofCard title="Joinery" subtitle="Tight seams, zero rattle"><JoinerySVG/></ProofCard>
            <ProofCard title="Hardware Cloth" subtitle="1/2″ mesh, wrapped & stapled"><MeshSVG/></ProofCard>
            <ProofCard title="Vent & Clean-out" subtitle="Dry interior, easy to service"><VentSVG/></ProofCard>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="section">
        <div className="wrap" style={{ padding: "72px 20px" }}>
          <div className="grid specs">
            <div>
              <h2 style={{margin:0,fontSize:32}}>Specs</h2>
              <ul style={{margin:"18px 0 0",padding:0,listStyle:"none",display:"grid",gap:12,color:"#ddd"}}>
                <li><span className="chip"><span className="ic" />Cedar / Pine</span></li>
                <li><span className="chip"><span className="ic" />Predator Latches</span></li>
                <li><span className="chip"><span className="ic" />Custom Dimensions</span></li>
                <li><span className="chip"><span className="ic" />Hand Finished</span></li>
              </ul>
            </div>
            <div><SpecGrid/></div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="section">
        <div className="wrap" style={{ padding: "72px 20px" }}>
          <h2 style={{margin:0,fontSize:32}}>Start Your Build</h2>
          <p className="muted" style={{margin:"6px 0 0"}}>Zero obligation. Send your rough config — we’ll reply with a dialed proposal.</p>
          <form
            onSubmit={(e)=>{e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); const url = mailtoQuote({ wood, roof, lengthFt, hardware, levels, roofMat, timedDoor, ...data }); window.location.href = url;}}
            style={{marginTop:22,display:"grid",gap:12,gridTemplateColumns:"repeat(1,1fr)"}}
          >
            <input name="name" placeholder="Your name" required className="spec" style={{padding:12}}/>
            <input name="email" type="email" placeholder="Email" required className="spec" style={{padding:12}}/>
            <input name="phone" placeholder="Phone (optional)" className="spec" style={{padding:12}}/>
            <input name="city" placeholder="City, State" className="spec" style={{padding:12}}/>
            <textarea name="notes" rows={4} placeholder="Notes (site photos, flock size, deadlines)" className="spec" style={{padding:12}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div className="muted" style={{fontSize:14}}>USA-made • Built to order</div>
              <button className="primary" style={{border:"none",borderRadius:14,padding:"12px 18px",cursor:"pointer"}}>Send</button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <section className="section">
        <div className="wrap footer" style={{ padding: "28px 20px 72px" }}>
          <div>© {new Date().getFullYear()} COOPS/USA — All rights reserved.</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span className="pulse"/><span>Hand-built in the USA</span></div>
        </div>
      </section>

      {/* Mobile Sticky */}
      <div className="mobile-sticky">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="muted" style={{fontSize:14}}>Visual estimate</div>
          <div style={{font:"700 18px/1 ui-sans-serif"}}>{`$${price.toLocaleString()}`}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
          <a className="primary" href={mailtoQuote({ wood, roof, lengthFt, hardware, levels, roofMat, timedDoor })}>Build</a>
          <a className="ghost" href="#build">Edit</a>
        </div>
      </div>
    </main>
  );
}

/* ---------- Subcomponents ---------- */

function ProofCard({ title, subtitle, children }) {
  return (
    <div className="card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
        <h3 style={{margin:0}}>{title}</h3>
        <span className="muted" style={{fontSize:12}}>craft</span>
      </div>
      <p className="muted" style={{margin:"6px 0 12px",fontSize:14}}>{subtitle}</p>
      <div className="card" style={{padding:12,height:180}}>{children}</div>
    </div>
  );
}

function JoinerySVG(){ return (
  <svg viewBox="0 0 300 160" width="100%" height="100%">
    <defs>
      <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b7773a"/><stop offset="100%" stopColor="#6e3f16"/>
      </linearGradient>
    </defs>
    <rect x="10" y="20" width="280" height="120" rx="14" fill="url(#wood)"/>
    <g opacity=".55">{Array.from({length:7}).map((_,i)=>(<rect key={i} x={25+i*38} y={20} width="18" height="60" fill="#000"/>))}</g>
    <rect x="10" y="80" width="280" height="60" rx="14" fill="#000" opacity=".2"/>
  </svg>
);}

function MeshSVG(){ return (
  <svg viewBox="0 0 300 160" width="100%" height="100%">
    <defs>
      <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M0 0 L16 0 M0 0 L0 16" stroke="#9ca3af" strokeWidth="1"/>
        <path d="M16 0 L16 16 M0 16 L16 16" stroke="#9ca3af" strokeWidth="1" opacity=".4"/>
      </pattern>
    </defs>
    <rect x="10" y="20" width="280" height="120" rx="12" fill="#111"/>
    <rect x="20" y="30" width="260" height="100" rx="10" fill="url(#grid)"/>
    <rect x="20" y="30" width="260" height="100" rx="10" fill="none" stroke="#9ca3af" strokeWidth="2"/>
  </svg>
);}

function VentSVG(){ return (
  <svg viewBox="0 0 300 160" width="100%" height="100%">
    <defs>
      <linearGradient id="vent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#111827"/><stop offset="100%" stopColor="#0b1220"/>
      </linearGradient>
    </defs>
    <rect x="10" y="20" width="280" height="120" rx="12" fill="url(#vent)"/>
    {Array.from({length:7}).map((_,i)=>(<rect key={i} x={26+i*36} y={30} width="14" height="100" fill="#1f2937"/>))}
    <path d="M20 120 C80 90,120 150,180 120 S260 140,290 110" stroke="#7dd3fc" strokeWidth="2" fill="none" opacity=".7"/>
  </svg>
);}

function SpecGrid(){
  const items = [
    { k:"Wood", v:"Cedar / Pine" },
    { k:"Roof", v:"Gable / Lean-to" },
    { k:"Mesh", v:"1/2″ hardware cloth" },
    { k:"Floor", v:"Raised, clean-out door" },
    { k:"Finish", v:"Hand-oiled" },
    { k:"Hardware", v:"Predator-proof latches" },
  ];
  return (
    <div className="specgrid">
      {items.map(it=>(
        <div key={it.k} className="spec">
          <div className="muted" style={{fontSize:12,textTransform:"uppercase",letterSpacing:".18em"}}>{it.k}</div>
          <div style={{fontWeight:600}}>{it.v}</div>
        </div>
      ))}
    </div>
  );
}

function CoopSVG({ woodColors, meshStroke, roof, roofMat, lengthFt, levels, timedDoor }) {
  const unit = 18; // px per foot (visual only)
  const coopH = 6 * unit;
  const L = Math.max(4, Math.min(16, lengthFt)) * unit;
  const D = 4 * unit;
  const isoX = 0.9, isoY = 0.5;
  const sox = D * isoX, soy = D * isoY;

  // taller so roof shows above; mild eave
  const roofH = unit * (roof === "gable" ? 1.6 : 1.0);
  const eave = unit * 0.6;

  function shade(hex, amt) {
    const x = hex.replace("#", "");
    const r = parseInt(x.slice(0,2),16), g = parseInt(x.slice(2,4),16), b = parseInt(x.slice(4,6),16);
    const t = v => Math.max(0, Math.min(255, Math.round(v + 255*amt)));
    return `#${t(r).toString(16).padStart(2,"0")}${t(g).toString(16).padStart(2,"0")}${t(b).toString(16).padStart(2,"0")}`;
  }

  const viewW = L + sox * 1.35;
  const viewH = coopH + roofH + soy + 70;
  const viewX = -sox * 0.45 - eave;
  const viewY = -(roofH + soy + 30);

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`} style={{ position:"absolute", inset:0 }}>
        <defs>
          <filter id="grain-wood" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="2" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .18 0" />
          </filter>
          <pattern id="mesh" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 0 L8 0 M0 0 L0 8" stroke={meshStroke} strokeWidth="1" />
            <path d="M8 0 L8 8 M0 8 L8 8" stroke={meshStroke} strokeWidth="1" opacity=".35" />
          </pattern>
          {/* sheet-metal corrugation */}
          <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9AA4AE"/><stop offset="50%" stopColor="#CBD5E1"/><stop offset="100%" stopColor="#8B95A1"/>
          </linearGradient>
          <pattern id="corr" width="10" height="6" patternUnits="userSpaceOnUse">
            <rect width="10" height="6" fill="url(#metalGrad)"/>
            <line x1="0" y1="3" x2="10" y2="3" stroke="#6B7280" strokeWidth="0.8" opacity="0.7"/>
          </pattern>
        </defs>

        {/* ground shadow */}
        <ellipse cx={L * 0.55} cy={coopH + soy + 26} rx={L * 0.45} ry={24} fill="black" opacity="0.35" />

        {/* ROOF FIRST (behind wall) — proportions to match your reference */}
        {roof === "gable" ? (
          <g>
            {/* top ridge plane with eave */}
            <polygon
              points={`${-eave},-${roofH} ${L + eave},-${roofH} ${L + sox},${soy - roofH * 0.5} ${sox},${soy - roofH * 0.5}`}
              fill={roofMat === 'metal' ? 'url(#corr)' : shade(woodColors.mid, -0.16)}
              stroke={roofMat === 'metal' ? '#6B7280' : woodColors.dark}
              strokeWidth="2"
            />
            {/* right face */}
            <polygon
              points={`${L * 0.55},-${roofH} ${L + sox * 0.55},${soy - roofH} ${L + sox},${soy} ${L},0`}
              fill={roofMat === 'metal' ? 'url(#corr)' : shade(woodColors.mid,-0.22)}
              stroke={roofMat === 'metal' ? '#6B7280' : woodColors.dark}
              strokeWidth="2"
              opacity=".95"
            />
            {/* left face */}
            <polygon
              points={`${L * 0.45},-${roofH} ${sox * 0.45},${soy - roofH} ${sox},${soy} 0,0`}
              fill={roofMat === 'metal' ? 'url(#corr)' : shade(woodColors.mid,-0.20)}
              stroke={roofMat === 'metal' ? '#6B7280' : woodColors.dark}
              strokeWidth="2"
              opacity=".95"
            />
          </g>
        ) : (
          <g>
            <polygon
              points={`${-eave},-${roofH} ${L + sox * 0.95},${soy - roofH * 0.15} ${L + sox},${soy} 0,0`}
              fill={roofMat === 'metal' ? 'url(#corr)' : shade(woodColors.mid,-0.18)}
              stroke={roofMat === 'metal' ? '#6B7280' : woodColors.dark}
              strokeWidth="2"
            />
          </g>
        )}

        {/* side/back wall (in front of roof) */}
        <polygon points={`${L},0 ${L+sox},${soy} ${L+sox},${coopH+soy} ${L},${coopH}`} fill={shade(woodColors.base,-.1)} stroke={shade(woodColors.dark,-.3)} strokeWidth="2" />
        {Array.from({length:6}).map((_,i)=>(<line key={i} x1={L} y1={(i+1)*(coopH/7)} x2={L+sox} y2={(i+1)*(coopH/7)+soy} stroke={woodColors.dark} strokeOpacity=".25" />))}

        {/* front face */}
        <path d={`M 0 0 L ${L} 0 L ${L} ${coopH} L 0 ${coopH} Z`} fill={woodColors.base} stroke={woodColors.dark} strokeWidth="2" />
        <rect x={0} y={0} width={L} height={coopH} fill="url(#grain-wood)" opacity=".45" />

        {/* partial loft + vertical ladder (levels=2) */}
        {levels === 2 && (
          <g>
            {/* loft platform high on left */}
            <rect
              x={unit * 0.8}
              y={coopH * 0.25}
              width={L * 0.65}
              height={unit * 0.9}
              rx="6"
              fill={shade(woodColors.base, -0.05)}
              stroke={woodColors.dark}
              strokeWidth="2"
              opacity="0.95"
            />
            {/* vertical ladder */}
            <line x1={unit * 2.8} y1={coopH * 0.25} x2={unit * 2.8} y2={coopH - unit * 0.2} stroke={woodColors.dark} strokeWidth="2"/>
            <line x1={unit * 3.2} y1={coopH * 0.25} x2={unit * 3.2} y2={coopH - unit * 0.2} stroke={woodColors.dark} strokeWidth="2"/>
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={i}
                x1={unit * 2.8}
                y1={coopH * 0.25 + i * (unit * 0.6)}
                x2={unit * 3.2}
                y2={coopH * 0.25 + i * (unit * 0.6)}
                stroke={woodColors.dark}
                strokeWidth="2"
              />
            ))}
          </g>
        )}

        {/* main door lowered near floor */}
        <g>
          <rect
            x={unit * 0.8}
            y={coopH - unit * 3.2 - unit * 0.5}
            width={unit * 2.8}
            height={unit * 3.2}
            rx="6"
            fill={shade(woodColors.base, -0.06)}
            stroke={woodColors.dark}
            strokeWidth="2"
          />
          <circle cx={unit * 3.3} cy={coopH - unit * 1.8} r={2.5} fill={meshStroke} />
          {timedDoor && (
            <g transform={`translate(${unit*0.9}, ${coopH - unit*3.3})`} opacity=".9">
              <rect width="20" height="14" rx="3" fill="#0b0b0c" stroke="#666" />
              <path d="M6 4 L6 8 L10 8" stroke="#fbbf24" strokeWidth="2" fill="none"/>
            </g>
          )}
        </g>

        {/* window with mesh */}
        <g>
          <rect x={L - unit * 3.6} y={unit * 1.1} width={unit * 2.6} height={unit * 1.8} rx="4" fill="url(#mesh)" stroke={meshStroke} strokeWidth="2" />
          <rect x={L - unit * 3.6} y={unit * 1.1} width={unit * 2.6} height={unit * 1.8} rx="4" fill="transparent" stroke={woodColors.dark} strokeWidth="2" opacity=".4" />
        </g>

        {/* clean-out box */}
        <g>
          <rect x={L - unit * 3.8} y={unit * 3.4} width={unit * 3.2} height={unit * 1.6} rx="6" fill={shade(woodColors.base, -0.08)} stroke={woodColors.dark} strokeWidth="2" />
          <line x1={L - unit * 2.7} y1={unit * 3.4} x2={L - unit * 2.7} y2={unit * 5.0} stroke={woodColors.dark} strokeOpacity=".3" />
        </g>

        {/* dimension line */}
        <g>
          <line x1={0} y1={coopH + 10} x2={L} y2={coopH + 10} stroke="#9CA3AF" strokeWidth="2" />
          <line x1={0} y1={coopH + 4} x2={0} y2={coopH + 16} stroke="#9CA3AF" strokeWidth="2" />
          <line x1={L} y1={coopH + 4} x2={L} y2={coopH + 16} stroke="#9CA3AF" strokeWidth="2" />
          <text x={L / 2} y={coopH + 28} textAnchor="middle" fontSize="14" fill="#E5E7EB" fontFamily="ui-monospace,Menlo,Consolas,monospace">
            {Math.round(L / unit)}′
          </text>
        </g>
      </svg>
    </div>
  );
}

function mailtoQuote({ wood, roof, lengthFt, hardware, levels, roofMat, timedDoor, name = "", email = "", phone = "", city = "", notes = "" }) {
  const subject = encodeURIComponent(`Custom Coop Quote — ${wood} · ${roof}/${roofMat} · ${lengthFt}ft · ${levels} level${levels===1?"":"s"}${timedDoor?" · timed door":""}`);
  const body = encodeURIComponent(
    [
      `Wood: ${wood}`,
      `Roof: ${roof}`,
      `Roof Material: ${roofMat}`,
      `Levels: ${levels}`,
      `Timed Door: ${timedDoor ? "Yes" : "No"}`,
      `Length: ${lengthFt} ft`,
      `Hardware: ${hardware}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `City: ${city}`,
      "",
      `Notes: ${notes}`,
    ].join("\n")
  );
  return `mailto:sales@example.com?subject=${subject}&body=${body}`;
}

/* ---------- Styles ---------- */
const styles = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(80% 120% at 50% -20%,rgba(255,255,255,.06),transparent 65%),#0b0b0c",
    color: "#f4f4f5",
    fontFamily:
      "ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial",
  },
};

const css = `
:root{--bg:#0b0b0c;--panel:#111114;--panel-2:#0f1115;--text:#f4f4f5;--muted:#b3b3b8;--line:#232327;--brand:#fbbf24;--brand-2:#d97706;--ok:#34d399}
*{box-sizing:border-box}
a{color:inherit}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.top{position:sticky;top:0;z-index:50;backdrop-filter:saturate(110%) blur(8px);background:rgba(11,11,12,.62);border-bottom:1px solid var(--line)}
.bar{height:64px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:12px;font-weight:700;letter-spacing:.2px}
.badge{height:36px;width:36px;display:grid;place-content:center;border-radius:12px;background:linear-gradient(135deg,var(--brand),var(--brand-2));box-shadow:0 0 36px -12px rgba(251,191,36,.85)}
.nav{display:none;gap:24px;color:#dadadd}
@media(min-width:768px){.nav{display:flex}}
.btn{border:1px solid #ffffff1a;background:#ffffff12;padding:10px 16px;border-radius:999px;font-weight:600}
.section{border-top:1px solid var(--line)}
.grid{display:grid;gap:24px}
@media(min-width:1024px){.hero{grid-template-columns:1fr 1.4fr}}
.h1{font-size:clamp(32px,5vw,52px);line-height:1.05;margin:0}
.muted{color:#c9c9cf}
.card{border:1px solid var(--line);background:linear-gradient(180deg,var(--panel),var(--panel-2));border-radius:24px;padding:20px;position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
.chip{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:#ffffff10;color:#e8e8ea;font-size:12px}
.controls label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:#a1a1a8;margin-bottom:8px}
.row{display:flex;gap:10px;flex-wrap:wrap}
.toggle{border-radius:999px;border:1px solid var(--line);background:#ffffff10;color:#d8d8dd;padding:8px 14px;font-weight:600}
.toggle.active{border-color:#f6ca5c;background:#f6ca5c22;color:#fff}
input[type=range]{width:100%}
.price{display:flex;align-items:center;justify-content:space-between;padding-top:8px}
.cta{display:flex;gap:10px}
.cta a{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:14px;font-weight:700;text-decoration:none}
.primary{background:var(--brand);color:#0b0b0c;box-shadow:0 10px 40px -15px rgba(251,191,36,.7)}
.ghost{background:#ffffff10;border:1px solid var(--line)}
.visual{perspective:1200px}
.tile{position:relative;transform-style:preserve-3d;border-radius:24px;border:1px solid var(--line);background:linear-gradient(180deg,var(--panel),var(--panel-2));padding:16px;min-height:420px}
.floating{position:absolute;inset:auto auto 16px 16px}
.floating.right{left:auto;right:16px;top:16px;bottom:auto}
.cards{grid-template-columns:repeat(1,1fr)}
@media(min-width:640px){.cards{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.cards{grid-template-columns:repeat(3,1fr)}}
.specs{grid-template-columns:1fr}
@media(min-width:1024px){.specs{grid-template-columns:1fr 1.5fr}}
.specgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(min-width:640px){.specgrid{grid-template-columns:repeat(3,1fr)}}
.spec{border:1px solid var(--line);background:#ffffff0d;padding:14px;border-radius:14px}
.footer{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#bdbdc2}
.pulse{display:inline-block;height:8px;width:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(52,211,153,0.7);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.7)}70%{box-shadow:0 0 0 12px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
.mobile-sticky{position:fixed;inset:auto 16px 16px 16px;z-index:60;border:1px solid var(--line);background:#101013e6;backdrop-filter:blur(8px);padding:12px;border-radius:18px;box-shadow:0 10px 40px -10px rgba(0,0,0,.6)}
@media(min-width:640px){.mobile-sticky{display:none}}
.ic{display:inline-block;width:16px;height:16px;margin-right:6px;border:2px solid currentColor;border-radius:3px}
`;
