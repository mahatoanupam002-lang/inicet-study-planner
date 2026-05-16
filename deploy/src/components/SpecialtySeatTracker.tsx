import { useState } from "react";
import { Stethoscope } from "lucide-react";

interface Specialty {
  name: string;
  seats: number;
  cutoffMin: number;
  cutoffMax: number;
  competition: string;
  color: string;
}

const SPECIALTIES: Specialty[] = [
  { name:"MD General Medicine",           seats:3500, cutoffMin:1000,  cutoffMax:8000,  competition:"Very High",    color:"#ff4d4d" },
  { name:"MS General Surgery",            seats:2800, cutoffMin:2000,  cutoffMax:10000, competition:"High",         color:"#c77dff" },
  { name:"MD Obstetrics & Gynaecology",   seats:3200, cutoffMin:2000,  cutoffMax:10000, competition:"High",         color:"#f72585" },
  { name:"MD Paediatrics",                seats:1800, cutoffMin:3000,  cutoffMax:12000, competition:"High",         color:"#4cc9f0" },
  { name:"MD Dermatology",                seats:700,  cutoffMin:500,   cutoffMax:1500,  competition:"Extreme",      color:"#f77f00" },
  { name:"MD Radiology",                  seats:1200, cutoffMin:1000,  cutoffMax:3000,  competition:"Very High",    color:"#d62828" },
  { name:"MD Psychiatry",                 seats:600,  cutoffMin:5000,  cutoffMax:15000, competition:"Moderate",     color:"#7b2d8b" },
  { name:"MD Ophthalmology",              seats:800,  cutoffMin:1500,  cutoffMax:4000,  competition:"Very High",    color:"#2ec4b6" },
  { name:"MS ENT",                        seats:500,  cutoffMin:2000,  cutoffMax:5000,  competition:"High",         color:"#06d6a0" },
  { name:"MS Orthopaedics",               seats:1500, cutoffMin:2000,  cutoffMax:5000,  competition:"High",         color:"#ff9f1c" },
  { name:"MD Anaesthesia",                seats:2500, cutoffMin:5000,  cutoffMax:20000, competition:"Moderate",     color:"#8ecae6" },
  { name:"MD Community Medicine (PSM)",   seats:800,  cutoffMin:10000, cutoffMax:30000, competition:"Low",          color:"#8338ec" },
  { name:"MD Pathology",                  seats:1500, cutoffMin:8000,  cutoffMax:25000, competition:"Low-Moderate", color:"#fb8500" },
  { name:"MD Microbiology",               seats:800,  cutoffMin:10000, cutoffMax:30000, competition:"Low",          color:"#ffb703" },
  { name:"MD Biochemistry",               seats:400,  cutoffMin:15000, cutoffMax:40000, competition:"Low",          color:"#06d6a0" },
  { name:"MD Pharmacology",               seats:400,  cutoffMin:15000, cutoffMax:40000, competition:"Low",          color:"#06d6a0" },
  { name:"MD Forensic Medicine",          seats:200,  cutoffMin:20000, cutoffMax:50000, competition:"Very Low",     color:"#adb5bd" },
  { name:"MD Emergency Medicine",         seats:800,  cutoffMin:8000,  cutoffMax:20000, competition:"Moderate",     color:"#ef233c" },
  { name:"MD Physical Medicine & Rehab",  seats:200,  cutoffMin:10000, cutoffMax:25000, competition:"Low",          color:"#b5838d" },
  { name:"MD Respiratory Medicine",       seats:600,  cutoffMin:6000,  cutoffMax:15000, competition:"Moderate",     color:"#52b788" },
];

const COMPETITION_COLORS: Record<string, string> = {
  "Extreme":      "bg-red-600/20 text-red-400 border-red-600/30",
  "Very High":    "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "High":         "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Moderate":     "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Low-Moderate": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  "Low":          "bg-green-500/20 text-green-400 border-green-500/30",
  "Very Low":     "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

const MAX_AIR = 50000;

export function SpecialtySeatTracker() {
  const [rankInput, setRankInput] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("All");

  const rank = parseInt(rankInput) || 0;

  const filtered = SPECIALTIES.filter(s => {
    if (competitionFilter !== "All" && s.competition !== competitionFilter) return false;
    return true;
  });

  const isEligible = (s: Specialty) => rank > 0 && rank >= s.cutoffMin && rank <= s.cutoffMax;
  const maybeEligible = (s: Specialty) => rank > 0 && rank > s.cutoffMax && rank <= s.cutoffMax * 1.3;

  const eligibleCount = rank > 0 ? SPECIALTIES.filter(s => isEligible(s)).length : 0;

  const competitionLevels = Array.from(new Set(SPECIALTIES.map(s => s.competition)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Stethoscope className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Specialty Seat Tracker</h2>
          <p className="text-sm text-muted-foreground font-mono">NEET PG All India Quota — 2023-24 data</p>
        </div>
      </div>

      {/* Rank input */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="text-xs font-mono text-muted-foreground block mb-1">Enter Your Estimated AIR</label>
          <input
            type="number"
            min="1"
            max="200000"
            placeholder="e.g. 5000"
            value={rankInput}
            onChange={e => setRankInput(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        {rank > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="text-green-400 font-mono font-bold">{eligibleCount}</span> specialties likely in range
          </div>
        )}
      </div>

      {/* Competition filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...competitionLevels].map(c => (
          <button
            key={c}
            onClick={() => setCompetitionFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${competitionFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Specialty</th>
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Seats</th>
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Cutoff AIR Range</th>
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground hidden sm:table-cell">Visual</th>
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Competition</th>
              {rank > 0 && <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Status</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const eligible = isEligible(s);
              const maybe = maybeEligible(s);
              return (
                <tr key={s.name} className={`border-b border-border/50 transition-colors ${eligible ? "bg-green-500/5" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="font-medium text-foreground text-xs">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.seats.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {s.cutoffMin.toLocaleString()} – {s.cutoffMax.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="relative h-3 w-40 bg-background rounded-full overflow-hidden">
                      <div
                        className="absolute h-3 rounded-full opacity-60"
                        style={{
                          left: `${(s.cutoffMin / MAX_AIR) * 100}%`,
                          width: `${((s.cutoffMax - s.cutoffMin) / MAX_AIR) * 100}%`,
                          backgroundColor: s.color,
                        }}
                      />
                      {rank > 0 && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white/80"
                          style={{ left: `${Math.min((rank / MAX_AIR) * 100, 100)}%` }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${COMPETITION_COLORS[s.competition] ?? "bg-card border-border text-muted-foreground"}`}>
                      {s.competition}
                    </span>
                  </td>
                  {rank > 0 && (
                    <td className="px-4 py-3">
                      {eligible ? (
                        <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">In Range</span>
                      ) : maybe ? (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Borderline</span>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Caveat */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-400/80">
        <strong className="text-amber-400">Important:</strong> Data based on 2023-24 NEET PG AI quota counselling trends. Actual cutoffs vary by year, candidate pool, and institutional preference. For guidance only — always verify with official MCC counselling data.
      </div>
    </div>
  );
}
