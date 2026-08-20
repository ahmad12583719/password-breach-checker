/**
 * Harbor Checkpoint page style: contemporary civic wayfinding with a calm, asymmetric checkpoint lane.
 */
import { useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, CircleHelp, LockKeyhole, Network, ShieldCheck, Sparkles } from "lucide-react";
import { PasswordCheckForm } from "@/components/PasswordCheckForm";
import { ResultPanel } from "@/components/ResultPanel";
import { checkPasswordBreach, type BreachCheckResult } from "@/lib/breachCheck";
import { analyzePassword } from "@/lib/passwordAnalysis";

const logoUrl = "/manus-storage/harbor-checkpoint-logo_4e9c3d1a.png";
const heroUrl = "/manus-storage/harbor-checkpoint-hero_b9eb0401.png";
const localAnalysisUrl = "/manus-storage/harbor-checkpoint-local-analysis_42b77f7d.png";
const rangeApiUrl = "/manus-storage/harbor-checkpoint-range-api_84e38dee.png";

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [breachResult, setBreachResult] = useState<BreachCheckResult | null>(null);
  const [breachError, setBreachError] = useState<string | null>(null);
  const analysis = useMemo(() => analyzePassword(password), [password]);
  const assessmentProgress = password ? Math.max(14, analysis.score) : 11;

  function handlePasswordChange(nextPassword: string) {
    // Reset the network result as soon as the in-memory input changes.
    setPassword(nextPassword);
    setBreachResult(null);
    setBreachError(null);
  }

  async function handleBreachCheck() {
    if (!password || isChecking) return;

    setIsChecking(true);
    setBreachError(null);
    try {
      const result = await checkPasswordBreach(password);
      setBreachResult(result);
    } catch (error) {
      setBreachResult(null);
      setBreachError(error instanceof Error ? error.message : "The breach service could not be reached. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="checkpoint-rail" aria-label="Harbor Checkpoint overview">
        <div>
          <a className="brand-lockup" href="#assessment" aria-label="Harbor Checkpoint home">
            <img src={logoUrl} alt="" className="brand-mark" />
            <span className="brand-name">Harbor<br />Checkpoint</span>
          </a>
          <div className="rail-rule" />
          <p className="rail-kicker">PASSWORD &amp;<br />BREACH HEALTH</p>
          <p className="rail-copy">Clear signals for passwords that should stay yours.</p>
        </div>

        <div className="rail-privacy-card">
          <LockKeyhole size={20} aria-hidden="true" />
          <p className="section-eyebrow">LOCAL BY DEFAULT</p>
          <p>We do not store, log, or write your password to disk.</p>
          <a href="#privacy">How this works <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </aside>

      <main className="main-lane">
        <header className="topbar">
          <p className="coordinate-label"><span /> LOCAL <b>•</b> PRIVATE <b>•</b> ON-DEVICE</p>
          <a href="#privacy" className="topbar-link">Privacy method <ArrowUpRight size={15} aria-hidden="true" /></a>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="hero-eyebrow"><ShieldCheck size={16} aria-hidden="true" /> Password health, without the handoff.</p>
            <h1 id="page-title">Check the signal,<br /><em>not your secrets.</em></h1>
            <p className="hero-description">Assess strength locally. Check breach exposure with a privacy-preserving hash prefix—not your password.</p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img src={heroUrl} alt="" />
            <div className="verification-stamp"><img src={logoUrl} alt="" /><span>LOCAL<br />FIRST</span></div>
          </div>
        </section>

        <section id="assessment" className="assessment-grid" aria-label="Password assessment">
          <div className="assessment-column">
            <div className="checkpoint-lane" aria-label={`Checkpoint lane at ${password ? analysis.rating : "ready"} status`}>
              <div className="lane-seal"><img src={logoUrl} alt="" /></div>
              <div className="lane-route" aria-hidden="true">
                <div className="lane-route__baseline" />
                <div className="lane-route__progress" style={{ width: `${assessmentProgress}%` }} />
                <span className="lane-route__station lane-route__station--start" />
                <span className="lane-route__station lane-route__station--middle" />
                <span className="lane-route__station lane-route__station--end" />
              </div>
              <div className="lane-readout"><span>CHECKPOINT LANE</span><b>{password ? analysis.rating.toUpperCase() : "READY"}</b></div>
            </div>
            <PasswordCheckForm
              password={password}
              showPassword={showPassword}
              isChecking={isChecking}
              disabled={!password}
              onPasswordChange={handlePasswordChange}
              onToggleVisibility={() => setShowPassword((current) => !current)}
              onSubmit={handleBreachCheck}
            />
            <div className="proof-row" aria-label="Privacy reassurance">
              <div><CheckCircle2 size={17} aria-hidden="true" /><span>10,000 common passwords checked locally</span></div>
              <div><CheckCircle2 size={17} aria-hidden="true" /><span>No account or install needed</span></div>
            </div>
          </div>
          <ResultPanel
            passwordPresent={Boolean(password)}
            analysis={analysis}
            breachResult={breachResult}
            breachError={breachError}
          />
        </section>

        <section id="privacy" className="privacy-section" aria-labelledby="privacy-title">
          <div className="privacy-heading">
            <p className="section-eyebrow">PRIVACY METHOD</p>
            <h2 id="privacy-title">Your password stays<br /><em>behind the boundary.</em></h2>
            <p>Exposure checks use <strong>k-anonymity</strong>, a technique that asks a breach service about many possible hashes while your full password stays on your device.</p>
          </div>
          <div className="privacy-steps">
            <article className="privacy-step">
              <img src={localAnalysisUrl} alt="Abstract visualization of a password staying inside a protected device boundary." />
              <div className="step-number">01</div>
              <h3>Hash here</h3>
              <p>Your browser converts the password to a SHA-1 hash locally. The plain password is never sent anywhere.</p>
            </article>
            <article className="privacy-step">
              <img src={rangeApiUrl} alt="Abstract visualization of five signal tiles crossing a boundary while the source remains sealed." />
              <div className="step-number">02</div>
              <h3>Ask broadly</h3>
              <p>Only the first five hash characters are sent to the Pwned Passwords Range API. The remaining 35 never leave this device.</p>
            </article>
            <article className="privacy-step privacy-step--text">
              <Network size={29} aria-hidden="true" />
              <img className="privacy-seal" src={logoUrl} alt="" />
              <div className="step-number">03</div>
              <h3>Match locally</h3>
              <p>The returned hash suffixes are compared in this browser. You see the result; no password record is created.</p>
              <div className="privacy-callout"><CircleHelp size={17} aria-hidden="true" /> SHA-1 here is an interoperability format for the range lookup, not a new way to store your password.</div>
            </article>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-mark"><Sparkles size={15} aria-hidden="true" /> Designed for calm, practical security.</div>
          <p>Use a password manager, keep every password unique, and enable two-factor authentication where available.</p>
        </footer>
      </main>
    </div>
  );
}
