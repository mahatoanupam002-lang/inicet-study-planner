import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface QualifyingRow {
  year: number;
  general: number;
  obc: number;
  sc_st: number;
  totalCandidates: number;
  qualified: number;
  note?: string;
}

interface SpecialtyTrend {
  specialty: string;
  cutoffs: { year: number; air: number }[];
  trend: string;
}

const QUALIFYING_DATA: QualifyingRow[] = [
  { year:2024, general:50, obc:40, sc_st:40, totalCandidates:198486, qualified:107684 },
  { year:2023, general:50, obc:40, sc_st:40, totalCandidates:201658, qualified:109827 },
  { year:2022, general:25, obc:20, sc_st:20, totalCandidates:193349, qualified:162528, note:"Reduced percentile due to seat shortage" },
  { year:2021, general:50, obc:40, sc_st:40, totalCandidates:164434, qualified:91318 },
  { year:2020, general:50, obc:40, sc_st:40, totalCandidates:155000, qualified:85000 },
];

const SPECIALTY_TRENDS: SpecialtyTrend[] = [
  { specialty:"MD Dermatology",       cutoffs:[{year:2020,air:600},{year:2021,air:750},{year:2022,air:900},{year:2023,air:1100},{year:2024,air:1200}], trend:"increasing" },
  { specialty:"MD Radiology",         cutoffs:[{year:2020,air:1500},{year:2021,air:1800},{year:2022,air:2000},{year:2023,air:2500},{year:2024,air:2800}], trend:"increasing" },
  { specialty:"MD Medicine",          cutoffs:[{year:2020,air:5000},{year:2021,air:6000},{year:2022,air:6500},{year:2023,air:7000},{year:2024,air:7500}], trend:"increasing" },
  { specialty:"MD Community Medicine",cutoffs:[{year:2020,air:25000},{year:2021,air:22000},{year:2022,air:20000},{year:2023,air:28000},{year:2024,air:30000}], trend:"stable" },
  { specialty:"MD Anaesthesia",       cutoffs:[{year:2020,air:15000},{year:2021,air:16000},{year:2022,air:18000},{year:2023,air:20000},{year:2024,air:20000}], trend:"stable" },
];

const KEY_INSIGHTS = [
  { text:"Dermatology AIR cutoff has increased ~100% in 5 years (600→1200)", color:"text-rose-400" },
  { text:"2022 anomaly: qualifying percentile reduced to 25% (General) due to seat shortage", color:"text-amber-400" },
  { text:"~50-55% of candidates qualify in a typical year", color:"text-blue-400" },
  { text:"Total candidates growing year-on-year (~1.9 lakh+ regularly appearing)", color:"text-green-400" },
  { text:"Competitive specialties: Dermatology, Radiology, Ophthalmology — cutoffs rising annually", color:"text-violet-400" },
];

const MAX_CANDIDATES = 210000;

export function CutoffHistory() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTY_TRENDS[0].specialty);

  const trend = SPECIALTY_TRENDS.find(t => t.specialty === selectedSpecialty)!;
  const maxAIR = Math.max(...(trend?.cutoffs.map(c => c.air) ?? [1]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">NEET PG Cutoff History</h2>
          <p className="text-sm text-muted-foreground font-mono">2020–2024 qualifying percentile & specialty trends</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {KEY_INSIGHTS.map((ins, i) => (
          <div key={i} className="bg-card border border-border rounded-xl px-4 py-3 flex items-start gap-2">
            <span className={`font-bold text-lg leading-none mt-0.5 ${ins.color}`}>•</span>
            <span className="text-xs text-muted-foreground">{ins.text}</span>
          </div>
        ))}
      </div>

      {/* Qualifying percentile table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Qualifying Percentile (Year-wise)</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Year</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">General</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">OBC</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">SC/ST</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Total Appeared</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Qualified</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Qual %</th>
              </tr>
            </thead>
            <tbody>
              {QUALIFYING_DATA.map(row => (
                <tr key={row.year} className={`border-b border-border/50 transition-colors ${row.note ? "bg-amber-500/5" : "hover:bg-card/50"}`}>
                  <td className="px-4 py-3 font-mono font-bold text-foreground">{row.year}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{row.general}th %ile</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{row.obc}th %ile</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{row.sc_st}th %ile</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{row.totalCandidates.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{row.qualified.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono ${row.note ? "text-amber-400" : "text-muted-foreground"}`}>
                      {Math.round(row.qualified / row.totalCandidates * 100)}%
                    </span>
                    {row.note && (
                      <div className="text-[10px] text-amber-400 mt-0.5 italic">{row.note}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidates trend bar chart */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Total Candidates Trend</h3>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
          {QUALIFYING_DATA.slice().reverse().map(row => (
            <div key={row.year} className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-10 text-right">{row.year}</span>
              <div className="flex-1 bg-background rounded-full h-6 overflow-hidden">
                <div
                  className="h-6 bg-primary/40 rounded-full flex items-center px-2 transition-all"
                  style={{ width: `${(row.totalCandidates / MAX_CANDIDATES) * 100}%` }}
                >
                  <span className="text-[10px] font-mono text-primary whitespace-nowrap">{(row.totalCandidates / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty cutoff trend */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Specialty Cutoff AIR Trend</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {SPECIALTY_TRENDS.map(t => (
            <button
              key={t.specialty}
              onClick={() => setSelectedSpecialty(t.specialty)}
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${selectedSpecialty === t.specialty ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
            >
              {t.specialty}
            </button>
          ))}
        </div>

        {trend && (
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{trend.specialty}</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${trend.trend === "increasing" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                Trend: {trend.trend}
              </span>
            </div>
            {trend.cutoffs.map(c => (
              <div key={c.year} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-10">{c.year}</span>
                <div className="flex-1 bg-background rounded-full h-5 overflow-hidden">
                  <div
                    className="h-5 bg-primary/50 rounded-full flex items-center px-2 transition-all"
                    style={{ width: `${(c.air / (maxAIR * 1.1)) * 100}%` }}
                  >
                    <span className="text-[10px] font-mono text-primary whitespace-nowrap">AIR {c.air.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-[10px] font-mono text-muted-foreground pt-2 border-t border-border">
              {trend.trend === "increasing"
                ? "Cutoffs rising — increasing competition for this specialty."
                : "Cutoffs relatively stable — consistent demand."}
            </div>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-muted-foreground bg-card border border-border rounded-xl px-4 py-3">
        Data sources: MCC NEET PG counselling results, NBE notifications 2020-2024. All data approximate and for educational reference only.
      </div>
    </div>
  );
}
