import { useEffect, useState } from "react";

const post = (url, body) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());
const box = { border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 20 };
const tag = (bg) => ({ background: bg, borderRadius: 12, padding: "2px 10px", marginRight: 6, fontSize: 13, display: "inline-block" });

export default function App() {
  const [data, setData] = useState({ clients: [], profiles: [] });
  const [clientId, setClientId] = useState("c1");
  const [profileId, setProfileId] = useState("p3");
  const [check, setCheck] = useState(null);
  const [text, setText] = useState("Bit short, not sure, maybe");
  const [fb, setFb] = useState(null);
  const [ins, setIns] = useState(null);

  useEffect(() => { fetch("/api/data").then((r) => r.json()).then(setData); fetch("/api/insights").then((r) => r.json()).then(setIns); }, []);
  useEffect(() => { setCheck(null); setFb(null); }, [clientId, profileId]);

  const client = data.clients.find((c) => c.id === clientId);
  const profile = data.profiles.find((p) => p.id === profileId);

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 820, margin: "24px auto", padding: "0 16px" }}>
      <h2>Preference Gate (prototype)</h2>
      <p>Blocks profiles that break a client's stated preferences before they are emailed, and turns free-text rejections into structured reasons.</p>

      <div style={box}>
        <b>Pick a client and a candidate profile</b><br /><br />
        <select value={clientId} onChange={(e) => setClientId(e.target.value)}>{data.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{" "}
        <select value={profileId} onChange={(e) => setProfileId(e.target.value)}>{data.profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        {client && profile && <pre style={{ background: "#f6f6f6", padding: 10, fontSize: 12, whiteSpace: "pre-wrap" }}>{"Preferences: " + JSON.stringify(client.prefs) + "\nProfile: " + JSON.stringify(profile)}</pre>}
      </div>

      <div style={box}>
        <b>1. Pre-send check</b> <button onClick={async () => setCheck(await post("/api/check", { clientId, profileId }))}>Check before sending</button>
        {check && (check.ok ? <p style={{ color: "green" }}>Safe to send: no stated preference broken.</p> : (
          <div><p style={{ color: "crimson" }}>Hold: {check.violations.length} stated preference(s) broken.</p>
            {check.violations.map((v) => <div key={v.field}><span style={tag("#fde2e2")}>{v.field}</span>wanted {v.expected}, profile has {String(v.actual)}</div>)}</div>))}
      </div>

      <div style={box}>
        <b>2. Structure a rejection</b><br /><br />
        <textarea rows={2} style={{ width: "100%" }} value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={async () => setFb(await post("/api/feedback", { clientId, profileId, text }))}>Parse feedback</button>
        {fb && (
          <div style={{ marginTop: 10 }}>
            {fb.reasons.map((r) => <span key={r} style={tag("#e2ecfd")}>{r}</span>)}
            <span style={tag(fb.soft ? "#fff3cd" : "#e6f4ea")}>{fb.soft ? "soft / unsure" : "firm"}</span>
            <span style={tag(fb.preventable ? "#fde2e2" : "#eee")}>{fb.preventable ? "PREVENTABLE: broke a stated preference" : "not preventable"}</span>
            {fb.newSignals.length > 0 && <p>New signal not in stated preferences: <b>{fb.newSignals.join(", ")}</b>. Suggest adding to client profile.</p>}
            <small>Parsed by: {fb.source}</small>
          </div>)}
      </div>

      {ins && (
        <div style={box}>
          <b>3. Insights on {ins.total} mocked rejections</b>
          <p><b>{ins.preventablePct}%</b> were preventable (profile broke a stated preference). <b>{ins.softPct}%</b> were soft/unsure (flip-flop candidates).</p>
          {ins.reasonCounts.map(([r, n]) => <div key={r}>{r}: {"█".repeat(n)} {n}</div>)}
        </div>)}
    </div>
  );
}
