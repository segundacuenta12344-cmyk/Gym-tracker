import { useState, useEffect } from "react";

const INITIAL_ROUTINES = {
  "Push A": {
    color: "#FF6B35", emoji: "🔥",
    exercises: [
      { id: 1, name: "Press banca barra", repsRange: "5–6" },
      { id: 2, name: "Press inclinado mancuernas", repsRange: "8–10" },
      { id: 3, name: "Press militar barra", repsRange: "5–6" },
      { id: 4, name: "Elevaciones laterales", repsRange: "12–15" },
      { id: 5, name: "Fondos", repsRange: "6–8" },
      { id: 6, name: "Tríceps polea", repsRange: "12–15" },
    ],
    defaultSets: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2 },
  },
  "Pull A": {
    color: "#4ECDC4", emoji: "💪",
    exercises: [
      { id: 7, name: "Jalón / Dominadas", repsRange: "5–6" },
      { id: 8, name: "Remo barra", repsRange: "5–6" },
      { id: 9, name: "Remo máquina unilateral", repsRange: "8–10" },
      { id: 10, name: "Face pull", repsRange: "12–15" },
      { id: 11, name: "Curl barra", repsRange: "8–10" },
      { id: 12, name: "Curl martillo", repsRange: "10–12" },
    ],
    defaultSets: { 7: 4, 8: 4, 9: 3, 10: 3, 11: 3, 12: 2 },
  },
  "Legs": {
    color: "#A855F7", emoji: "🦵",
    exercises: [
      { id: 13, name: "Sentadilla", repsRange: "5–6" },
      { id: 14, name: "Prensa", repsRange: "10–12" },
      { id: 15, name: "Peso muerto rumano", repsRange: "8–10" },
      { id: 16, name: "Curl femoral", repsRange: "10–12" },
      { id: 17, name: "Extensión cuádriceps", repsRange: "12–15" },
      { id: 18, name: "Gemelos", repsRange: "12–20" },
    ],
    defaultSets: { 13: 4, 14: 3, 15: 3, 16: 3, 17: 2, 18: 4 },
  },
};

const DAYS = ["Push A", "Pull A", "Legs"];
let nextId = 100;

const btnBase = {
  border: "none", cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  display: "flex", alignItems: "center", justifyContent: "center",
};

async function loadData(key, fallback) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; } catch { return fallback; }
}
async function saveData(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch {}
}

function SetInput({ value, onChange, color, prefilled }) {
  return (
    <input
      type="number" min="0" step="0.5" placeholder="—" value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: prefilled && value ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${prefilled && value ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "6px", color: prefilled && value ? "rgba(255,255,255,0.45)" : "#fff",
        padding: "6px 4px", fontSize: "13px", textAlign: "center", outline: "none", transition: "all 0.2s",
      }}
      onFocus={(e) => { e.target.style.borderColor = color; e.target.style.color = "#fff"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
    />
  );
}

function ExerciseCard({ exercise, color, sets, prevSets, onChangeSet, onAddSet, onRemoveSet, onRemoveExercise }) {
  const allDone = sets.length > 0 && sets.every((s) => s.kg && s.reps);
  const n = sets.length;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "#fff" }}>{exercise.name}</span>
          <span style={{ marginLeft: "8px", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{n}× · {exercise.repsRange}</span>
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {allDone && <span style={{ color, fontSize: "14px", marginRight: "4px" }}>✓</span>}
          <button onClick={onRemoveExercise}
            style={{ ...btnBase, background: "rgba(255,255,255,0.05)", borderRadius: "6px", width: "26px", height: "26px", fontSize: "13px", color: "rgba(255,100,100,0.6)", flexShrink: 0, transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "#ff6b6b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,100,100,0.6)"; }}
          >✕</button>
        </div>
      </div>

      {n > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `38px repeat(${n}, 1fr) 28px`, gap: "5px", alignItems: "center", marginBottom: "8px" }}>
          <div />
          {sets.map((_, i) => (
            <div key={i} style={{ textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>S{i + 1}</div>
              {n > 1 && (
                <button onClick={() => onRemoveSet(i)}
                  style={{ ...btnBase, position: "absolute", top: "-1px", right: "-2px", width: "11px", height: "11px", fontSize: "8px", background: "rgba(255,80,80,0.25)", borderRadius: "50%", color: "rgba(255,120,120,0.9)", padding: 0 }}
                >×</button>
              )}
            </div>
          ))}
          <div />

          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>KG</div>
          {sets.map((s, i) => (
            <SetInput key={i} value={s.kg} onChange={(v) => onChangeSet(i, "kg", v)} color={color} prefilled={!!prevSets?.[i]?.kg && s.kg === prevSets[i].kg} />
          ))}
          <div />

          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>REPS</div>
          {sets.map((s, i) => (
            <SetInput key={i} value={s.reps} onChange={(v) => onChangeSet(i, "reps", v)} color={color} prefilled={!!prevSets?.[i]?.reps && s.reps === prevSets[i].reps} />
          ))}
          <div />
        </div>
      )}

      <button onClick={onAddSet}
        style={{ ...btnBase, width: "100%", padding: "5px", background: "transparent", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "6px", fontSize: "11px", color: "rgba(255,255,255,0.35)", gap: "4px", transition: "all 0.15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
      >+ Añadir serie</button>
    </div>
  );
}

function AddExerciseForm({ color, onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [reps, setReps] = useState("");
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", color: "#fff", padding: "8px 10px", fontSize: "13px", outline: "none", marginBottom: "8px", fontFamily: "'Syne', sans-serif", boxSizing: "border-box" };
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: `1px dashed ${color}66`, borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
      <div style={{ fontSize: "11px", color, fontFamily: "monospace", marginBottom: "10px", letterSpacing: "0.1em" }}>NUEVO EJERCICIO</div>
      <input type="text" placeholder="Nombre del ejercicio" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = color)} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} autoFocus />
      <input type="text" placeholder="Rango reps (ej: 8–12)" value={reps} onChange={(e) => setReps(e.target.value)} style={{ ...inputStyle, fontFamily: "monospace" }}
        onFocus={(e) => (e.target.style.borderColor = color)} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
        onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onAdd(name.trim(), reps.trim() || "—"); }} />
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => { if (name.trim()) onAdd(name.trim(), reps.trim() || "—"); }}
          style={{ ...btnBase, flex: 1, padding: "8px", background: color, borderRadius: "7px", color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em" }}>AÑADIR</button>
        <button onClick={onCancel}
          style={{ ...btnBase, padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "7px", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Cancelar</button>
      </div>
    </div>
  );
}

function RoutineView({ routineName, routines, onBack, onUpdateRoutine, onAddSession, lastSession }) {
  const routine = routines[routineName];

  const [sets, setSets] = useState(() =>
    Object.fromEntries(routine.exercises.map((ex) => {
      const prev = lastSession?.sets?.[ex.id];
      const numSets = prev?.length || routine.defaultSets[ex.id] || 3;
      return [ex.id, Array.from({ length: numSets }, (_, i) => ({
        kg: prev?.[i]?.kg ?? "",
        reps: prev?.[i]?.reps ?? "",
      }))];
    }))
  );

  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const totalSets = Object.values(sets).reduce((a, s) => a + s.length, 0);
  const filledSets = Object.values(sets).flat().filter((s) => s.kg && s.reps).length;
  const progress = totalSets > 0 ? Math.round((filledSets / totalSets) * 100) : 0;

  const handleChangeSet = (exId, setIdx, field, value) => { setSets((p) => ({ ...p, [exId]: p[exId].map((s, i) => i === setIdx ? { ...s, [field]: value } : s) })); setSaved(false); };
  const handleAddSet = (exId) => { setSets((p) => ({ ...p, [exId]: [...p[exId], { kg: "", reps: "" }] })); setSaved(false); };
  const handleRemoveSet = (exId, setIdx) => { setSets((p) => ({ ...p, [exId]: p[exId].filter((_, i) => i !== setIdx) })); setSaved(false); };
  const handleRemoveExercise = (exId) => {
    onUpdateRoutine(routineName, { ...routine, exercises: routine.exercises.filter((e) => e.id !== exId) });
    setSets((p) => { const n = { ...p }; delete n[exId]; return n; }); setSaved(false);
  };
  const handleAddExercise = (name, repsRange) => {
    const id = nextId++;
    onUpdateRoutine(routineName, { ...routine, exercises: [...routine.exercises, { id, name, repsRange }], defaultSets: { ...routine.defaultSets, [id]: 3 } });
    setSets((p) => ({ ...p, [id]: [{ kg: "", reps: "" }, { kg: "", reps: "" }, { kg: "", reps: "" }] }));
    setShowAddForm(false); setSaved(false);
  };
  const handleSave = () => {
    const date = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    onAddSession({ routine: routineName, date, sets, exercises: routine.exercises, note, progress });
    setSaved(true);
  };

  const hasPrefill = !!lastSession;

  return (
    <div>
      <button onClick={onBack} style={{ ...btnBase, background: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", padding: "0 0 20px 0", gap: "6px" }}>← Volver</button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: hasPrefill ? "10px" : "20px" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "monospace", color: routine.color, letterSpacing: "0.15em", marginBottom: "4px" }}>{routine.emoji} SESIÓN ACTIVA</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", margin: 0 }}>{routineName}</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "32px", fontFamily: "'Syne', sans-serif", fontWeight: 800, color: routine.color }}>{progress}%</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>completado</div>
        </div>
      </div>

      {hasPrefill && (
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: routine.color, fontSize: "13px" }}>↑</span>
          Valores del {lastSession.date} · toca para editar
        </div>
      )}

      <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", marginBottom: "20px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: routine.color, borderRadius: "99px", transition: "width 0.4s ease" }} />
      </div>

      {routine.exercises.map((ex) => (
        <ExerciseCard
          key={ex.id} exercise={ex} color={routine.color}
          sets={sets[ex.id] || []}
          prevSets={lastSession?.sets?.[ex.id]}
          onChangeSet={(i, f, v) => handleChangeSet(ex.id, i, f, v)}
          onAddSet={() => handleAddSet(ex.id)}
          onRemoveSet={(i) => handleRemoveSet(ex.id, i)}
          onRemoveExercise={() => handleRemoveExercise(ex.id)}
        />
      ))}

      {showAddForm
        ? <AddExerciseForm color={routine.color} onAdd={handleAddExercise} onCancel={() => setShowAddForm(false)} />
        : <button onClick={() => setShowAddForm(true)}
            style={{ ...btnBase, width: "100%", padding: "12px", background: "transparent", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "10px", color: "rgba(255,255,255,0.35)", fontSize: "13px", gap: "6px", marginBottom: "16px", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = routine.color; e.currentTarget.style.color = routine.color; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
          >+ Añadir ejercicio</button>
      }

      <textarea placeholder="Notas de la sesión..." value={note} onChange={(e) => setNote(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "rgba(255,255,255,0.7)", padding: "12px", fontSize: "13px", fontFamily: "'Syne', sans-serif", resize: "none", outline: "none", minHeight: "60px", boxSizing: "border-box", marginBottom: "12px" }} />

      <button onClick={handleSave}
        style={{ ...btnBase, width: "100%", padding: "14px", background: saved ? "rgba(255,255,255,0.08)" : routine.color, borderRadius: "10px", color: "#fff", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em", transition: "all 0.3s" }}>
        {saved ? "✓ SESIÓN GUARDADA" : "GUARDAR SESIÓN"}
      </button>
    </div>
  );
}

function HistoryView({ sessions, onBack, onDeleteSession }) {
  if (sessions.length === 0) {
    return (
      <div>
        <button onClick={onBack} style={{ ...btnBase, background: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", padding: "0 0 20px 0" }}>← Volver</button>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: "60px", fontFamily: "'Syne', sans-serif" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
          <div>Aún no hay sesiones registradas</div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <button onClick={onBack} style={{ ...btnBase, background: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", padding: "0 0 20px 0" }}>← Volver</button>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#fff", marginBottom: "20px", fontSize: "24px" }}>Historial</h2>
      {[...sessions].reverse().map((session, idx) => {
        const realIdx = sessions.length - 1 - idx;
        const routineInfo = INITIAL_ROUTINES[session.routine] || { color: "#888", emoji: "🏋️" };
        return (
          <div key={idx} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${routineInfo.color}`, borderRadius: "10px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff" }}>{routineInfo.emoji} {session.routine}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{session.date}</span>
                <button onClick={() => onDeleteSession(realIdx)}
                  style={{ ...btnBase, background: "none", fontSize: "13px", color: "rgba(255,100,100,0.45)", width: "20px", height: "20px", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,100,100,0.45)")}
                >🗑</button>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: routineInfo.color, fontFamily: "monospace", marginBottom: "8px" }}>{session.progress}% completado</div>
            {session.note && <div style={{ marginBottom: "8px", fontSize: "12px", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>{session.note}</div>}
            {session.exercises?.map((ex) => {
              const exSets = (session.sets[ex.id] || []).filter((s) => s.kg && s.reps);
              if (!exSets.length) return null;
              return (
                <div key={ex.id} style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "3px", fontFamily: "monospace" }}>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{ex.name}:</span>{" "}
                  {exSets.map((s) => `${s.kg}kg×${s.reps}`).join(" | ")}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [routines, setRoutines] = useState(INITIAL_ROUTINES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedSessions = await loadData("ppl:sessions", []);
      const savedRoutines = await loadData("ppl:routines", INITIAL_ROUTINES);
      setSessions(savedSessions);
      setRoutines(savedRoutines);
      setLoading(false);
    })();
  }, []);

  const addSession = async (session) => {
    const updated = [...sessions, session];
    setSessions(updated);
    await saveData("ppl:sessions", updated);
  };
  const deleteSession = async (idx) => {
    const updated = sessions.filter((_, i) => i !== idx);
    setSessions(updated);
    await saveData("ppl:sessions", updated);
  };
  const updateRoutine = async (name, updated) => {
    const newRoutines = { ...routines, [name]: updated };
    setRoutines(newRoutines);
    await saveData("ppl:routines", newRoutines);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.1em" }}>CARGANDO...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "32px 20px", fontFamily: "'Syne', sans-serif", maxWidth: "480px", margin: "0 auto" }}>

        {view === "home" && (
          <div>
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "8px" }}>CICLO PPL · 4 SEMANAS</div>
              <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                Mi<br />
                <span style={{ background: "linear-gradient(90deg, #FF6B35, #4ECDC4, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Entrenamiento
                </span>
              </h1>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "14px", fontFamily: "monospace" }}>RUTINAS</div>
              {DAYS.map((day) => {
                const routine = routines[day];
                const daySessions = sessions.filter((s) => s.routine === day);
                const last = [...sessions].reverse().find((s) => s.routine === day);
                return (
                  <button key={day} onClick={() => { setActiveRoutine(day); setView("routine"); }}
                    style={{ ...btnBase, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px", marginBottom: "10px", textAlign: "left", justifyContent: "space-between", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = routine.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  >
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>{routine.emoji} {day}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                        {routine.exercises.length} ejercicios · {daySessions.length} sesiones
                        {last && <span style={{ color: routine.color }}> · último: {last.date}</span>}
                      </div>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: routine.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", flexShrink: 0 }}>→</div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "32px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "14px", fontFamily: "monospace" }}>RESUMEN</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Sesiones", value: sessions.length, color: "#FF6B35" },
                  { label: "Push A", value: sessions.filter((s) => s.routine === "Push A").length, color: "#FF6B35" },
                  { label: "Pull A", value: sessions.filter((s) => s.routine === "Pull A").length, color: "#4ECDC4" },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "14px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.1em" }}>{stat.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>

            {sessions.length > 0 && (
              <button onClick={() => setView("history")}
                style={{ ...btnBase, width: "100%", marginTop: "16px", padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "0.05em" }}>
                VER HISTORIAL ({sessions.length})
              </button>
            )}
          </div>
        )}

        {view === "routine" && activeRoutine && (
          <RoutineView
            routineName={activeRoutine}
            routines={routines}
            onBack={() => setView("home")}
            onUpdateRoutine={updateRoutine}
            onAddSession={addSession}
            lastSession={[...sessions].reverse().find((s) => s.routine === activeRoutine)}
          />
        )}

        {view === "history" && (
          <HistoryView sessions={sessions} onBack={() => setView("home")} onDeleteSession={deleteSession} />
        )}
      </div>
    </>
  );
}
