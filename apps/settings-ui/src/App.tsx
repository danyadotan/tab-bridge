import React, {useEffect, useMemo, useRef, useState} from "react";

/** ===== helpers ===== */
const LS = {
    get<T=any>(k:string, d:T):T {
          try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
    },
    set(k:string, v:any){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const todayKey = () => new Date().toISOString().slice(0,10);

type Mode = "local" | "hybrid";
type Sensing = "S0"|"S1"|"S2"|"S3";
type LogItem = { ts:number; kind:string; detail?:any };

function useExplainLog(){
    const [items, setItems] = useState<LogItem[]>(()=>LS.get("demo.log",[]));
    const add = (kind:string, detail?:any)=>{
          const it = { ts: Date.now(), kind, detail };
          setItems(prev=>{ const next = [it, ...prev].slice(0,200); LS.set("demo.log", next); return next; });
    };
    const clear = ()=>{ setItems([]); LS.set("demo.log", []); };
    return {items, add, clear};
}

/** ===== Global styles (themes + tokens) ===== */
const GlobalStyle = ({theme, dys}:{theme:string; dys:boolean}) => (
    <style>{`
        :root{
              --radius: 16px;
                    --space-1: 8px; --space-2: 12px; --space-3: 16px; --space-4: 24px; --space-5: 36px;
                          --shadow-1: 0 6px 24px rgba(0,0,0,.16);
                                --shadow-2: 0 10px 40px rgba(0,0,0,.24);
                                      --chip: 8px 12px;
                                          }
                                              body{
                                                    margin:0;
                                                          font-family: ${dys ? `'OpenDyslexic', Arial, sans-serif` : `system-ui, -apple-system, Segoe UI, Roboto, Arial`};
                                                                background: var(--bg); color: var(--text);
                                                                    }
                                                                        .container{ max-width: 920px; margin: 0 auto; padding: var(--space-5) var(--space-4) 120px; }
                                                                            .surface{ background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-1); }
                                                                                .h1{ font-weight: 700; font-size: 18px; letter-spacing:.4px }
                                                                                    .chip{ display:inline-flex; gap:6px; padding: var(--chip); border-radius: 999px; background: var(--surface-2); border: 1px solid rgba(255,255,255,.06); font-size: 12px; }
                                                                                        .btn{ padding: 10px 14px; border-radius: 12px; border:1px solid rgba(255,255,255,.08); background: var(--surface-2); color: var(--text); cursor:pointer; }
                                                                                            .btn:hover{ filter: brightness(1.07); }
                                                                                                .btn.ghost{ background: transparent; }
                                                                                                    
                                                                                                        /* ===== themes ===== */
                                                                                                            .theme-serene-dark{ --bg:#0E1018; --surface:#151827; --surface-2:#1B2030; --text:#EDEBFA; --muted:#B5B0D2; --accent:#C59CFF; }
                                                                                                                .theme-purple-dark{ --bg:#0F0B18; --surface:#161126; --surface-2:#1E1733; --text:#ECE8FF; --muted:#B7AFD9; --accent:#C08AFF; }
                                                                                                                    .theme-green-dark{ --bg:#0D1613; --surface:#0F1D19; --surface-2:#132622; --text:#EAF7F3; --muted:#B3D4CB; --accent:#8BD9C7; }
                                                                                                                        .theme-cream{ --bg:#F8F5EF; --surface:#FFFFFF; --surface-2:#F3EFE6; --text:#2A2A2A; --muted:#6E6A57; --accent:#A66BFF; }
                                                                                                                            
                                                                                                                                .spark{ position: fixed; right: 18px; top: 50%; transform: translateY(-50%); width:56px; height:56px; border-radius: 20px; background: var(--surface); box-shadow: var(--shadow-2); display:grid; place-items:center; cursor:pointer; z-index:50; }
                                                                                                                                    .spark:after{ content:"✦"; font-size: 22px; color: var(--accent); }
                                                                                                                                        .panel{ position: fixed; right: 86px; top: 50%; transform: translateY(-50%); width: 360px; max-height: 78vh; overflow:auto; padding: 16px; border-radius: 20px; background: var(--surface); border:1px solid rgba(255,255,255,.08); box-shadow: var(--shadow-2); z-index: 60; }
                                                                                                                                            .li{ padding: 10px 0; display:grid; gap:6px }
                                                                                                                                                .label{ font-size: 12px; opacity:.8 }
                                                                                                                                                    select, input[type=text]{ background: var(--surface-2); border:1px solid rgba(255,255,255,.1); color: var(--text); padding: 8px 10px; border-radius: 10px; }
                                                                                                                                                        .row{ display:flex; gap:8px; flex-wrap:wrap }
                                                                                                                                                            .kbd{ font-size: 11px; padding: 2px 6px; border-radius: 6px; background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08) }
                                                                                                                                                              `}</style>style>
  );

/** ===== Tiny toast ===== */
function useToast(){
    const [msg,setMsg] = useState<string|null>(null);
    useEffect(()=>{ if(!msg) return; const t=setTimeout(()=>setMsg(null),1500); return ()=>clearTimeout(t); },[msg]);
    return {msg, show:setMsg};
}

/** ===== Panel (Respect Settings) ===== */
function Panel(props:{
    theme:string; setTheme:(t:string)=>void;
    mode:Mode; setMode:(m:Mode)=>void;
    dys:boolean; setDys:(b:boolean)=>void;
    sensing:Sensing; setSensing:(s:Sensing)=>void;
    pinGoal:(g:string)=>void;
    log:(k:string,d?:any)=>void;
    resetPrefs:()=>void;
}){
    const [goalText,setGoalText]=useState("");
    return (
          <div className="panel">
                <div className="h1" style={{marginBottom:8}}>Respect Settings</div>div>
                
                <div className="li">
                        <div className="label">Appearance</div>div>
                        <select value={props.theme} onChange={e=>{props.setTheme(e.target.value); props.log("theme.changed",{value:e.target.value});}}>
                                  <option value="serene-dark">Serene Dark (default)</option>option>
                                  <option value="purple-dark">Purple Dark</option>option>
                                  <option value="green-dark">Green Dark</option>option>
                                  <option value="cream">Boring Light</option>option>
                        </select>select>
                        <label style={{display:'flex',gap:8,alignItems:'center'}}>
                                  <input type="checkbox" checked={props.dys} onChange={e=>{props.setDys(e.target.checked); props.log("font.dyslexic",{on:e.target.checked});}}/> Dyslexia-friendly font
                        </label>label>
                </div>div>
          
                <div className="li">
                        <div className="label">Mode</div>div>
                        <div className="row">
                                  <button className={`btn ${props.mode==='local'?'':'ghost'}`} onClick={()=>{props.setMode('local'); props.log("mode.local");}}>Local-Only</button>button>
                                  <button className={`btn ${props.mode==='hybrid'?'':'ghost'}`} onClick={()=>{props.setMode('hybrid'); props.log("mode.hybrid");}}>Hybrid (Sync)</button>button>
                        </div>div>
                </div>div>
          
                <div className="li">
                        <div className="label">Sensing level</div>div>
                        <div className="row">
                          {(["S0","S1","S2","S3"] as Sensing[]).map(s=>(
                        <button key={s} className={`btn ${props.sensing===s?'':'ghost'}`} onClick={()=>{props.setSensing(s); props.log("sensing.set",{level:s});}}>{s}</button>button>
                      ))}
                        </div>div>
                </div>div>
          
                <div className="li">
                        <div className="label">Goal for now (4+1)</div>div>
                        <input placeholder="Type one clear goal…" value={goalText} onChange={e=>setGoalText(e.target.value)} />
                        <button className="btn" onClick={()=>{ if(!goalText.trim()) return; props.pinGoal(goalText.trim()); setGoalText(""); props.log("goal.pinned"); }}>Pin Goal</button>button>
                </div>div>
          
                <div className="li">
                        <div className="label">Vending Agents (demo)</div>div>
                        <div className="row">
                                  <button className="btn" onClick={()=>props.log("agent.run",{name:"File Sorter"})}>File Sorter</button>button>
                                  <button className="btn" onClick={()=>props.log("agent.run",{name:"Form Filler"})}>Form Filler</button>button>
                                  <button className="btn" onClick={()=>props.log("agent.run",{name:"Route Helper"})}>Route Helper</button>button>
                        </div>div>
                </div>div>
          
                <div className="li">
                        <button className="btn ghost" onClick={props.resetPrefs}>Reset demo (clear prefs)</button>button>
                        <div style={{fontSize:12, opacity:.6}}>Shortcut: open panel <span className="kbd">Ctrl</span>span>+<span className="kbd">;</span>span></div>div>
                </div>div>
          </div>div>
        );
}

/** ===== Main demo ===== */
export default function App(){
    const DEFAULT_THEME = "serene-dark";
    const [theme,setTheme] = useState<string>(LS.get("demo.theme", DEFAULT_THEME));
    const [dys,setDys] = useState<boolean>(LS.get("demo.dys", false));
    const [mode,setMode] = useState<Mode>(LS.get("demo.mode","local"));
    const [sensing,setSensing] = useState<Sensing>(LS.get("demo.sensing","S0"));
    const [goal,setGoal] = useState<string>(LS.get("demo.goal",""));
    const [panel,setPanel] = useState<boolean>(false);
    const {items:adds, add:log, clear} = useExplainLog();
    const {msg, show} = useToast();
  
    useEffect(()=>LS.set("demo.theme", theme),[theme]);
    useEffect(()=>LS.set("demo.dys", dys),[dys]);
    useEffect(()=>LS.set("demo.mode", mode),[mode]);
    useEffect(()=>LS.set("demo.sensing", sensing),[sensing]);
    useEffect(()=>LS.set("demo.goal", goal),[goal]);
  
    useEffect(()=>{
          const onKey = (e:KeyboardEvent)=>{
                  if((e.ctrlKey||e.metaKey) && e.key === ';'){ e.preventDefault(); setPanel(p=>!p); }
          };
          window.addEventListener('keydown', onKey);
          return ()=>window.removeEventListener('keydown', onKey);
    },[]);
  
    useEffect(()=>{
          document.body.classList.remove('theme-serene-dark','theme-purple-dark','theme-green-dark','theme-cream');
          document.body.classList.add(`theme-${theme}`);
    },[theme]);
  
    const pinGoal = (g:string)=>{ setGoal(g); show("Goal pinned"); };
    const resetPrefs = ()=>{
          Object.keys(localStorage).filter(k=>k.startsWith('demo.')).forEach(k=>localStorage.removeItem(k));
          location.reload();
    };
  
    return (
          <div className={`theme-${theme}`}>
                <GlobalStyle theme={theme} dys={dys} />
                
                <div className="container">
                        <header className="surface" style={{padding:12, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                                  <div className="h1">TAB Overlay</div>div>
                                  <span className="chip">Theme: {theme}</span>span>
                                  <span className="chip">Mode: {mode}</span>span>
                                  <span className="chip">Sensing: {sensing}</span>span>
                          {goal ? <span className="chip">Goal: {goal}</span>span> : <span className="chip" style={{opacity:.7}}>No goal yet</span>span>}
                        </header>header>
                        
                        <div style={{height:16}}/>
                        
                        <div className="surface" style={{padding:16, display:'grid', gap:12}}>
                                  <div className="h1">Overview</div>div>
                                  <div className="row">
                                              <span className="chip">4+1 model</span>span>
                                              <span className="chip">Explainability Log</span>span>
                                              <span className="chip">Serene Dark default</span>span>
                                  </div>div>
                                  <div style={{opacity:.8}}>
                                              TAB meets the user where they are; BRIDGE-iT adds orchestration of temporary agents ("Vending Agents"). Local-Only by default; Hybrid for optional sync.
                                  </div>div>
                                  <div className="row">
                                              <button className="btn" onClick={()=>setPanel(true)}>Open Respect Settings</button>button>
                                  </div>div>
                        </div>div>
                </div>div>
          
                <button className="spark" aria-label="Open Respect Settings" onClick={()=>setPanel(p=>!p)} />
                
            {panel && (
                    <Panel
                                theme={theme} setTheme={setTheme}
                                mode={mode} setMode={setMode}
                                dys={dys} setDys={setDys}
                                sensing={sensing} setSensing={setSensing}
                                pinGoal={pinGoal}
                                log={(k,d)=>{ log(k,d); show(k.replace('.',' ')); }}
                                resetPrefs={resetPrefs}
                              />
                  )}
          
            {msg && <div style={{position:'fixed',right:20,bottom:24,background:'var(--surface)',border:'1px solid rgba(255,255,255,.08)',padding:'12px 14px',borderRadius:12,boxShadow:'var(--shadow-2)'}}>{msg}</div>div>}
          </div>div>
        );
}</style>
