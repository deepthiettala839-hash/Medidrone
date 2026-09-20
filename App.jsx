import { useEffect, useMemo, useState } from "react";
import { Activity, Ambulance, BellRing, Bot, Boxes, Building2, ChevronRight, CircleUserRound, Cross, Drone, HeartPulse, Hospital, MapPin, Menu, Package, Pill, Radio, ShieldCheck, Siren, Stethoscope, Truck, UserRound, X } from "lucide-react";
import { io } from "socket.io-client";
import api from "./api";

const demoEmergencies = [
  { id: "DEMO-104", patient_name: "Demo Patient", type: "Ambulance + Drone", priority: "critical", status: "responding", assigned_resource: "MediDrone Alpha" },
  { id: "DEMO-105", patient_name: "Sample Patient", type: "Blood", priority: "high", status: "new", assigned_resource: "EMS Team 03" },
  { id: "DEMO-106", patient_name: "Sample Patient 2", type: "Emergency Kit", priority: "high", status: "dispatched", assigned_resource: "Ambulance 07" }
];

function Stat({ icon: Icon, label, value, tone }) {
  return <div className="stat-card"><div className={`icon-box ${tone || ""}`}><Icon size={20}/></div><div><div className="stat-value">{value}</div><div className="muted">{label}</div></div></div>;
}

function App() {
  const [tab, setTab] = useState("Command Center");
  const [sidebar, setSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [emergencies, setEmergencies] = useState(demoEmergencies);
  const [drones, setDrones] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [message, setMessage] = useState("");
  const [emergencyForm, setEmergencyForm] = useState({ type: "Ambulance", description: "", latitude: "", longitude: "" });

  const nav = [
    ["Command Center", Activity],
    ["Patient Services", Cross],
    ["Orders & Tracking", Package],
    ["Doctor Guidance", Stethoscope],
    ["Payments", Boxes],
    ["Verification", ShieldCheck]
  ];

  const loadData = async () => {
    try {
      const [e, d, h, p, m] = await Promise.all([
        api.get("/emergencies"), api.get("/drones"), api.get("/hospitals/nearby"),
        api.get("/pharmacies/nearby"), api.get("/medicines")
      ]);
      if (e.data.length) setEmergencies(e.data);
      setDrones(d.data); setHospitals(h.data); setPharmacies(p.data); setMedicines(m.data);
    } catch {
      setMessage("Backend not connected — dashboard is showing demo data.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("medidrone_token");
    if (token) setUser(JSON.parse(localStorage.getItem("medidrone_user") || "null"));
    loadData();
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { autoConnect: true });
    socket.on("emergency:created", item => setEmergencies(prev => [item, ...prev]));
    socket.on("emergency:updated", item => setEmergencies(prev => prev.map(x => x.id === item.id ? item : x)));
    return () => socket.disconnect();
  }, []);

  const critical = emergencies.filter(e => e.priority === "critical").length;
  const high = emergencies.filter(e => e.priority === "high").length;

  async function createEmergency() {
    try {
      const result = await api.post("/emergencies", emergencyForm);
      setEmergencies(prev => [result.data.emergency, ...prev]);
      setMessage(`Emergency ${result.data.emergency.id} created. AI priority: ${result.data.ai.priority}.`);
      setShowEmergency(false);
    } catch {
      setMessage("Please log in and ensure the backend/database is running.");
    }
  }

  async function dispatchDrone(id) {
    try {
      await api.post(`/drones/${id}/dispatch`);
      setMessage("Drone dispatch recorded.");
      loadData();
    } catch { setMessage("Drone dispatch requires an available drone and authentication."); }
  }

  const pageTitle = useMemo(() => tab === "Command Center" ? "AI Emergency Command Center" : tab, [tab]);

  return <div className="app">
    <header className="topbar">
      <div className="brand"><button className="icon-button mobile-only" onClick={() => setSidebar(!sidebar)}><Menu size={20}/></button><div className="brand-mark"><HeartPulse size={21}/></div><div><strong>MediDrone</strong><span>Emergency Healthcare Network</span></div></div>
      <div className="network"><span className="pulse"></span> Emergency Network Online <span className="network-sub">Monitoring connected facilities</span></div>
      <div className="top-actions"><button className="icon-button"><BellRing size={19}/></button><div className="avatar"><CircleUserRound size={20}/></div></div>
    </header>

    <div className="layout">
      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <div className="side-label">NAVIGATION</div>
        {nav.map(([name, Icon]) => <button key={name} className={`nav-item ${tab === name ? "active" : ""}`} onClick={() => {setTab(name); setSidebar(false)}}><Icon size={18}/><span>{name}</span>{tab === name && <ChevronRight size={16} className="nav-arrow"/>}</button>)}
        <div className="side-footer"><div className="secure"><Radio size={17}/><div><strong>Live monitoring</strong><span>Real-time response system</span></div></div></div>
      </aside>

      <main className="content">
        <div className="page-head"><div><div className="eyebrow">GOVERNMENT / EMS OPERATIONS</div><h1>{pageTitle}</h1><p>AI-assisted coordination for faster, safer medical response.</p></div><button className="emergency-btn" onClick={() => setShowEmergency(true)}><Siren size={18}/> Emergency Help</button></div>
        {message && <div className="notice">{message}<button onClick={() => setMessage("")}><X size={15}/></button></div>}

        {tab === "Command Center" && <>
          <div className="stats-grid">
            <Stat icon={Siren} label="Active Emergencies" value={emergencies.length || 12} tone="red"/>
            <Stat icon={Bot} label="AI Priority — Critical" value={String(critical || 4).padStart(2,"0")} tone="purple"/>
            <Stat icon={Activity} label="AI Priority — High" value={String(high || 5).padStart(2,"0")} tone="amber"/>
            <Stat icon={Hospital} label="Nearest Facility" value="4.2 km" tone="blue"/>
            <Stat icon={Drone} label="Drones Available" value={drones.filter(d=>d.status==="available").length || 3} tone="cyan"/>
            <Stat icon={Ambulance} label="Ambulances Ready" value="07" tone="green"/>
          </div>

          <div className="main-grid">
            <section className="panel map-panel">
              <div className="panel-head"><div><h2>Live Response Map</h2><span className="muted">Patient → Drone → Hospital → Ambulance</span></div><span className="live-tag"><span className="pulse"></span> LIVE</span></div>
              <div className="map">
                <div className="road r1"></div><div className="road r2"></div><div className="road r3"></div><div className="road r4"></div>
                <div className="map-label patient"><UserRound size={15}/> Patient</div>
                <div className="map-label drone"><Drone size={15}/> Drone</div>
                <div className="map-label hospital"><Building2 size={15}/> Hospital</div>
                <div className="map-label ambulance"><Ambulance size={15}/> Ambulance</div>
                <div className="route"></div>
              </div>
              <div className="map-legend"><span><i className="dot patient-dot"></i>Patient</span><span><i className="dot drone-dot"></i>Drone</span><span><i className="dot hospital-dot"></i>Hospital</span><span><i className="dot ambulance-dot"></i>Ambulance</span></div>
            </section>

            <section className="panel coordinator">
              <div className="panel-head"><div><h2><Bot size={19}/> AI Emergency Coordinator</h2><span className="muted">Decision support — human approval required</span></div></div>
              <div className="ai-card"><div className="ai-icon"><Bot size={25}/></div><div><strong>Priority monitoring active</strong><p>Analyzing emergency type, resource availability and response proximity.</p></div></div>
              <div className="recommend"><span>RECOMMENDED NEXT ACTION</span><strong>Review critical emergencies and dispatch the nearest available response resource.</strong><button onClick={() => setTab("Orders & Tracking")}>Open response queue <ChevronRight size={15}/></button></div>
              <div className="resource-mini"><div><Drone size={17}/><span>Drones</span><strong>{drones.filter(d=>d.status==="available").length || 3}</strong></div><div><Ambulance size={17}/><span>Ambulances</span><strong>07</strong></div><div><Hospital size={17}/><span>Hospitals</span><strong>{hospitals.length || 8}</strong></div></div>
            </section>
          </div>

          <div className="three-grid">
            <section className="panel"><div className="panel-head"><h2>Emergency Queue</h2><button className="text-button" onClick={()=>setShowEmergency(true)}>+ New alert</button></div>
              <div className="list">{emergencies.slice(0,4).map(e=><div className="list-row" key={e.id}><div className={`priority ${e.priority}`}></div><div className="grow"><strong>{e.patient_name || "Patient"} · {e.type}</strong><span>{e.assigned_resource || "Awaiting assignment"}</span></div><span className={`status ${e.status}`}>{e.status}</span></div>)}</div>
            </section>
            <section className="panel"><div className="panel-head"><h2>Pharmacy & Supplies</h2><Pill size={18}/></div><div className="supply-grid"><div><strong>{medicines.length || 24}</strong><span>Medicines</span></div><div><strong>12</strong><span>First Aid Kits</span></div><div><strong>08</strong><span>Oxygen</span></div><div><strong>05</strong><span>Blood Requests</span></div></div><button className="wide-button" onClick={()=>setTab("Patient Services")}>Manage supplies <ChevronRight size={15}/></button></section>
            <section className="panel"><div className="panel-head"><h2>Response Teams</h2><Truck size={18}/></div><div className="team"><div className="team-icon"><Stethoscope size={17}/></div><div><strong>Doctors & Specialists</strong><span>12 active</span></div></div><div className="team"><div className="team-icon"><UserRound size={17}/></div><div><strong>Nurses & Field Staff</strong><span>18 active</span></div></div><div className="team"><div className="team-icon"><Ambulance size={17}/></div><div><strong>EMS / Ambulance</strong><span>07 ready</span></div></div></section>
          </div>
        </>}

        {tab === "Patient Services" && <Services medicines={medicines} pharmacies={pharmacies} onEmergency={()=>setShowEmergency(true)} setMessage={setMessage}/>}
        {tab === "Orders & Tracking" && <Tracking emergencies={emergencies} drones={drones} dispatchDrone={dispatchDrone}/>}
        {tab === "Doctor Guidance" && <Info title="Doctor Guidance" icon={Stethoscope} text="Use this area for appointment requests, home visits, nurse visits, doctor voice messages and AI-assisted translation. Clinical advice should remain under qualified medical supervision."/>}
        {tab === "Payments" && <Info title="Payments & Verification" icon={Boxes} text="Connect a compliant payment provider and OTP verification service here. Never store raw banking credentials or OTP values in your frontend."/>}
        {tab === "Verification" && <Info title="Verification & Safety" icon={ShieldCheck} text="Patient identity, medical consent, emergency authorization, operator approval and audit logs should be verified before production deployment."/>}
      </main>
    </div>

    {showEmergency && <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><div className="eyebrow">EMERGENCY ALERT</div><h2>Request immediate assistance</h2></div><button className="icon-button" onClick={()=>setShowEmergency(false)}><X/></button></div><label>Emergency type<select value={emergencyForm.type} onChange={e=>setEmergencyForm({...emergencyForm,type:e.target.value})}><option>Ambulance</option><option>Drone</option><option>Blood</option><option>Emergency Kit</option><option>Medical Emergency</option></select></label><label>Description<textarea placeholder="Describe the emergency..." value={emergencyForm.description} onChange={e=>setEmergencyForm({...emergencyForm,description:e.target.value})}/></label><div className="form-grid"><label>Latitude<input value={emergencyForm.latitude} onChange={e=>setEmergencyForm({...emergencyForm,latitude:e.target.value})}/></label><label>Longitude<input value={emergencyForm.longitude} onChange={e=>setEmergencyForm({...emergencyForm,longitude:e.target.value})}/></label></div><div className="modal-actions"><button className="secondary" onClick={()=>setShowEmergency(false)}>Cancel</button><button className="emergency-btn" onClick={createEmergency}><Siren size={17}/> Send alert</button></div></div></div>}
  </div>
}

function Services({ medicines, pharmacies, onEmergency, setMessage }) {
  const cards = [
    ["Medicines", Pill, "Order medicines and track delivery."],
    ["First Aid Kit", Cross, "Request emergency first-aid supplies."],
    ["Blood Availability", HeartPulse, "Find compatible blood resources."],
    ["Doctor Visit", Stethoscope, "Request a doctor home visit."],
    ["Nurse at Home", UserRound, "Arrange nursing support."],
    ["Ambulance", Ambulance, "Request emergency transport."],
    ["Drone Delivery", Drone, "Request eligible medical delivery."],
    ["Oxygen Supply", Activity, "Check oxygen/ventilation supply."],
    ["Diagnostic Kit", Activity, "Request diagnostic/sample kits."]
  ];
  return <div><div className="service-grid">{cards.map(([title,Icon,desc])=><button className="service-card" key={title} onClick={()=> title==="Ambulance" || title==="Drone Delivery" ? onEmergency() : setMessage(`${title}: service workflow selected.`)}><div className="service-icon"><Icon size={22}/></div><div><strong>{title}</strong><span>{desc}</span></div><ChevronRight/></button>)}</div><div className="three-grid lower"><section className="panel"><div className="panel-head"><h2>Available Medicines</h2><Pill/></div>{(medicines.length?medicines:[{name:"Paracetamol",stock:120},{name:"Oral Rehydration Salts",stock:80},{name:"First Aid Antiseptic",stock:45}]).slice(0,6).map(m=><div className="list-row" key={m.id||m.name}><div className="pill-dot"></div><div className="grow"><strong>{m.name}</strong><span>Stock: {m.stock}</span></div><button className="small-button" onClick={()=>setMessage(`Medicine request started for ${m.name}.`)}>Request</button></div>)}</section><section className="panel"><div className="panel-head"><h2>Open Pharmacies</h2><Building2/></div>{(pharmacies.length?pharmacies:[{name:"MediCare Pharmacy",address:"Nearby facility"}]).map(p=><div className="team" key={p.id||p.name}><div className="team-icon"><MapPin/></div><div><strong>{p.name}</strong><span>{p.address || "Nearby"}</span></div></div>)}</section></div></div>
}

function Tracking({ emergencies, drones, dispatchDrone }) {
  return <div className="three-grid"><section className="panel span-two"><div className="panel-head"><h2>Emergency Tracking</h2><MapPin/></div>{emergencies.map(e=><div className="tracking-row" key={e.id}><div><strong>#{e.id} · {e.patient_name || "Patient"}</strong><span>{e.type} · {e.priority}</span></div><span className={`status ${e.status}`}>{e.status}</span></div>)}</section><section className="panel"><div className="panel-head"><h2>Drone Fleet</h2><Drone/></div>{(drones.length?drones:[{id:1,name:"MediDrone Alpha",status:"available",battery_percent:94},{id:2,name:"MediDrone Beta",status:"available",battery_percent:81}]).map(d=><div className="list-row" key={d.id}><div className="grow"><strong>{d.name}</strong><span>{d.status} · {d.battery_percent}% battery</span></div>{d.status==="available"&&<button className="small-button" onClick={()=>dispatchDrone(d.id)}>Dispatch</button>}</div>)}</section></div>
}

function Info({title,icon:Icon,text}) {
  return <section className="panel info-panel"><div className="info-icon"><Icon size={32}/></div><h2>{title}</h2><p>{text}</p><div className="info-points"><span><ShieldCheck/> Human approval</span><span><Radio/> Audit trail</span><span><HeartPulse/> Patient safety</span></div></section>
}

export default App;
