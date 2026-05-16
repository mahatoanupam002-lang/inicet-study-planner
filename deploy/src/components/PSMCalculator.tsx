import { useState, useMemo } from "react";
import { Calculator, BookOpen } from "lucide-react";

type Mode = "calculator" | "reference";

interface TwoByTwo {
  tp: string; fp: string; fn: string; tn: string;
}

interface ExpUnexp {
  exposed_yes: string; exposed_no: string;
  unexposed_yes: string; unexposed_no: string;
}

const NFHS5 = [
  { label: "MMR (SRS 2018-20)", value: "97 per 1,00,000 live births" },
  { label: "IMR (NFHS-5)", value: "35.2 per 1,000 live births" },
  { label: "NMR (NFHS-5)", value: "28.2 per 1,000 live births" },
  { label: "U5MR (NFHS-5)", value: "41.9 per 1,000 live births" },
  { label: "TFR (NFHS-5)", value: "2.0 (National)" },
];

const PSM_FORMULAS = [
  { name: "Sensitivity", formula: "TP / (TP + FN) × 100", notes: "Ability to detect true positives. High sensitivity → fewer false negatives." },
  { name: "Specificity", formula: "TN / (TN + FP) × 100", notes: "Ability to correctly exclude disease. High specificity → fewer false positives." },
  { name: "PPV (Positive Predictive Value)", formula: "TP / (TP + FP) × 100", notes: "Probability that a positive test reflects true disease. Depends on prevalence." },
  { name: "NPV (Negative Predictive Value)", formula: "TN / (TN + FN) × 100", notes: "Probability that a negative test reflects true absence. Increases with low prevalence." },
  { name: "Accuracy", formula: "(TP + TN) / (TP + FP + FN + TN) × 100", notes: "Overall proportion of correct results." },
  { name: "LR+ (Likelihood Ratio Positive)", formula: "Sensitivity / (1 − Specificity)", notes: "LR+ > 10 = strong evidence of disease." },
  { name: "LR− (Likelihood Ratio Negative)", formula: "(1 − Sensitivity) / Specificity", notes: "LR− < 0.1 = strong evidence against disease." },
  { name: "Prevalence", formula: "(TP + FN) / Total × 100", notes: "Background rate of disease in the population." },
  { name: "Odds Ratio (OR)", formula: "(TP × TN) / (FP × FN)", notes: "Used in case-control studies. OR ≈ RR when disease is rare." },
  { name: "Relative Risk (RR)", formula: "Incidence(Exposed) / Incidence(Unexposed)", notes: "Used in cohort studies. RR = 1 → no association." },
  { name: "Attributable Risk (AR)", formula: "Incidence(Exposed) − Incidence(Unexposed)", notes: "Risk attributable to the exposure." },
  { name: "NNT (Number Needed to Treat)", formula: "1 / ARR (Absolute Risk Reduction)", notes: "How many patients need treatment to prevent 1 event." },
];

function safeNum(s: string): number {
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function pct(n: number): string {
  return isFinite(n) ? n.toFixed(1) + "%" : "—";
}

function fixed(n: number, d = 2): string {
  return isFinite(n) ? n.toFixed(d) : "—";
}

export function PSMCalculator() {
  const [mode, setMode] = useState<Mode>("calculator");
  const [t, setT] = useState<TwoByTwo>({ tp: "", fp: "", fn: "", tn: "" });
  const [e, setE] = useState<ExpUnexp>({ exposed_yes: "", exposed_no: "", unexposed_yes: "", unexposed_no: "" });

  const calc = useMemo(() => {
    const tp = safeNum(t.tp); const fp = safeNum(t.fp);
    const fn = safeNum(t.fn); const tn = safeNum(t.tn);
    const total = tp + fp + fn + tn;
    const sens = total > 0 ? tp / (tp + fn) * 100 : NaN;
    const spec = total > 0 ? tn / (tn + fp) * 100 : NaN;
    const ppv  = (tp + fp) > 0 ? tp / (tp + fp) * 100 : NaN;
    const npv  = (tn + fn) > 0 ? tn / (tn + fn) * 100 : NaN;
    const acc  = total > 0 ? (tp + tn) / total * 100 : NaN;
    const lrPos = (spec < 100) ? (sens / 100) / (1 - spec / 100) : NaN;
    const lrNeg = (spec > 0)   ? (1 - sens / 100) / (spec / 100) : NaN;
    const prev  = total > 0 ? (tp + fn) / total * 100 : NaN;
    const or    = (fp > 0 && fn > 0) ? (tp * tn) / (fp * fn) : NaN;

    const ey = safeNum(e.exposed_yes); const en = safeNum(e.exposed_no);
    const uy = safeNum(e.unexposed_yes); const un = safeNum(e.unexposed_no);
    const incExp   = (ey + en) > 0 ? ey / (ey + en) : NaN;
    const incUnexp = (uy + un) > 0 ? uy / (uy + un) : NaN;
    const rr  = incUnexp > 0 ? incExp / incUnexp : NaN;
    const ar  = isFinite(incExp) && isFinite(incUnexp) ? (incExp - incUnexp) * 100 : NaN;
    const nnt = isFinite(ar) && ar !== 0 ? Math.abs(100 / ar) : NaN;

    return { sens, spec, ppv, npv, acc, lrPos, lrNeg, prev, or, rr, ar, nnt };
  }, [t, e]);

  const StatCard = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) => (
    <div className={`bg-card border rounded-lg p-3 ${color}`}>
      <div className="text-xs font-mono text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-bold font-mono text-foreground">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1 italic">{sub}</div>}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">PSM Calculator</h2>
          <p className="text-sm text-muted-foreground font-mono">Biostatistics & Epidemiology</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["calculator", "reference"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {m === "calculator" ? <Calculator className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            {m === "calculator" ? "2×2 Calculator" : "Formula Reference"}
          </button>
        ))}
      </div>

      {mode === "calculator" && (
        <div className="flex flex-col gap-6">
          {/* 2x2 Table */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm">2×2 Table Inputs</h3>
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">TP (True Positive)</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={t.tp} onChange={ev => setT(p => ({ ...p, tp: ev.target.value }))} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">FP (False Positive)</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={t.fp} onChange={ev => setT(p => ({ ...p, fp: ev.target.value }))} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">FN (False Negative)</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={t.fn} onChange={ev => setT(p => ({ ...p, fn: ev.target.value }))} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">TN (True Negative)</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={t.tn} onChange={ev => setT(p => ({ ...p, tn: ev.target.value }))} />
              </div>
            </div>
          </div>

          {/* RR/AR Inputs */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Exposed / Unexposed (for RR & AR)</h3>
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">Exposed — Disease Yes</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={e.exposed_yes} onChange={ev => setE(p => ({ ...p, exposed_yes: ev.target.value }))} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">Exposed — Disease No</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={e.exposed_no} onChange={ev => setE(p => ({ ...p, exposed_no: ev.target.value }))} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">Unexposed — Disease Yes</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={e.unexposed_yes} onChange={ev => setE(p => ({ ...p, unexposed_yes: ev.target.value }))} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground mb-1">Unexposed — Disease No</div>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:border-primary" type="number" min="0" placeholder="0" value={e.unexposed_no} onChange={ev => setE(p => ({ ...p, unexposed_no: ev.target.value }))} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Calculated Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard label="Sensitivity" value={pct(calc.sens)} sub="TP / (TP+FN)" color="border-green-500/30" />
              <StatCard label="Specificity" value={pct(calc.spec)} sub="TN / (TN+FP)" color="border-blue-500/30" />
              <StatCard label="PPV" value={pct(calc.ppv)} sub="TP / (TP+FP)" color="border-violet-500/30" />
              <StatCard label="NPV" value={pct(calc.npv)} sub="TN / (TN+FN)" color="border-cyan-500/30" />
              <StatCard label="Accuracy" value={pct(calc.acc)} sub="(TP+TN) / Total" color="border-amber-500/30" />
              <StatCard label="LR+" value={fixed(calc.lrPos)} sub={isFinite(calc.lrPos) ? (calc.lrPos > 10 ? "Strong evidence" : calc.lrPos > 5 ? "Moderate" : "Weak") : ""} color="border-orange-500/30" />
              <StatCard label="LR−" value={fixed(calc.lrNeg)} sub={isFinite(calc.lrNeg) ? (calc.lrNeg < 0.1 ? "Strong exclusion" : calc.lrNeg < 0.2 ? "Moderate" : "Weak") : ""} color="border-rose-500/30" />
              <StatCard label="Prevalence" value={pct(calc.prev)} sub="(TP+FN) / Total" color="border-border" />
              <StatCard label="Odds Ratio" value={fixed(calc.or)} sub="(TP×TN)/(FP×FN)" color="border-pink-500/30" />
              <StatCard label="Relative Risk" value={fixed(calc.rr)} sub="Inc(Exp)/Inc(Unexp)" color="border-indigo-500/30" />
              <StatCard label="Attributable Risk" value={isFinite(calc.ar) ? fixed(calc.ar) + "%" : "—"} sub="Inc(Exp)−Inc(Unexp)" color="border-teal-500/30" />
              <StatCard label="NNT" value={isFinite(calc.nnt) ? fixed(calc.nnt, 1) : "—"} sub="1 / ARR" color="border-lime-500/30" />
            </div>
          </div>

          {/* Interpretation guide */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-2 text-sm">Interpretation Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
              <div>LR+ &gt; 10 → Strong evidence of disease</div>
              <div>LR− &lt; 0.1 → Strong evidence against disease</div>
              <div>OR = 1 → No association</div>
              <div>RR = 1 → No increased risk</div>
              <div>NNT = 1 → Treatment always prevents event</div>
              <div>Sensitivity ↑ → Better screening test</div>
              <div>Specificity ↑ → Better confirmatory test</div>
              <div>PPV depends heavily on prevalence</div>
            </div>
          </div>
        </div>
      )}

      {mode === "reference" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PSM_FORMULAS.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="font-semibold text-foreground text-sm mb-1">{f.name}</div>
                <div className="text-primary font-mono text-xs mb-2 bg-background/50 rounded px-2 py-1">{f.formula}</div>
                <div className="text-xs text-muted-foreground">{f.notes}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-amber-400 mb-3 text-sm">NFHS-5 Key Statistics (India)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NFHS5.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-2 bg-card rounded-lg px-3 py-2">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
