/**
 * Harbor Checkpoint component style: a measured status report with one clear next move.
 */
import { AlertTriangle, BadgeCheck, Check, CircleAlert, ShieldAlert, WifiOff } from "lucide-react";
import type { PasswordAnalysis } from "@/lib/passwordAnalysis";
import type { BreachCheckResult } from "@/lib/breachCheck";

type ResultPanelProps = {
  passwordPresent: boolean;
  analysis: PasswordAnalysis;
  breachResult: BreachCheckResult | null;
  breachError: string | null;
};

function getVerdict(
  passwordPresent: boolean,
  analysis: PasswordAnalysis,
  breachResult: BreachCheckResult | null,
  breachError: string | null,
) {
  if (!passwordPresent) {
    return {
      tone: "neutral",
      label: "Ready to assess",
      title: "A private health check, on your terms.",
      description: "Enter a password to see a local strength assessment. Nothing is saved by this app.",
      icon: BadgeCheck,
    } as const;
  }

  if (breachResult?.found) {
    return {
      tone: "breached",
      label: "Breached",
      title: "Change this password now.",
      description: `It appears in known breach data ${breachResult.count.toLocaleString()} times. Do not reuse it anywhere.`,
      icon: ShieldAlert,
    } as const;
  }

  if (analysis.rating === "Weak" || analysis.rating === "Fair") {
    return {
      tone: "weak",
      label: analysis.rating === "Weak" ? "Weak" : "Needs work",
      title: "The password needs a stronger foundation.",
      description: "Strength signals show predictable choices or too little length. A longer, unique passphrase is safer.",
      icon: AlertTriangle,
    } as const;
  }

  if (breachError) {
    return {
      tone: "weak",
      label: "Lookup unavailable",
      title: "Local check complete. Exposure lookup needs a retry.",
      description: breachError,
      icon: WifiOff,
    } as const;
  }

  if (breachResult) {
    return {
      tone: "safe",
      label: "No match reported",
      title: "No match appeared in the returned breach range.",
      description: "That is a positive signal, not a permanent guarantee. Keep this password unique and use two-factor authentication.",
      icon: BadgeCheck,
    } as const;
  }

  return {
    tone: "neutral",
    label: "Strength assessed",
    title: "Local analysis is complete.",
    description: "Run the optional exposure check to compare a hash prefix with breach data while keeping your password private.",
    icon: CircleAlert,
  } as const;
}

export function ResultPanel({ passwordPresent, analysis, breachResult, breachError }: ResultPanelProps) {
  const verdict = getVerdict(passwordPresent, analysis, breachResult, breachError);
  const VerdictIcon = verdict.icon;
  const criteria = [
    ["12+ characters", analysis.criteria.length],
    ["Upper & lower case", analysis.criteria.mixedCase],
    ["A number", analysis.criteria.number],
    ["A symbol", analysis.criteria.symbol],
    ["Not in common list", analysis.criteria.uncommon],
  ] as const;

  return (
    <section className={`result-panel result-panel--${verdict.tone}`} aria-live="polite">
      <div className="result-header">
        <div className="verdict-mark" aria-hidden="true">
          <VerdictIcon size={23} strokeWidth={2.2} />
        </div>
        <div>
          <p className="section-eyebrow">CURRENT VERDICT</p>
          <div className="verdict-label-row">
            <span className="status-dot" aria-hidden="true" />
            <span>{verdict.label}</span>
          </div>
        </div>
      </div>
      <div className="result-tide-line" aria-hidden="true">
        <div className="result-tide-line__base" />
        <div className="result-tide-line__fill" style={{ width: `${passwordPresent ? Math.max(12, analysis.score) : 10}%` }} />
        <span /><span /><span /><span /><span /><span />
      </div>

      <h2>{verdict.title}</h2>
      <p className="verdict-description">{verdict.description}</p>

      {passwordPresent && (
        <>
          <div className="result-rule" />
          <div className="local-score-header">
            <div>
              <p className="section-eyebrow">LOCAL STRENGTH</p>
              <p className="strength-rating">{analysis.rating}</p>
            </div>
            <span className="score-number">{analysis.score}<small>/100</small></span>
          </div>
          <div className="strength-meter" aria-label={`Password strength: ${analysis.rating}, ${analysis.score} out of 100`}>
            <div className="strength-meter__track">
              <div className="strength-meter__fill" style={{ width: `${analysis.score}%` }} />
            </div>
            <div className="strength-meter__ticks" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <p className="entropy-note">Estimated search space: <strong>{analysis.entropy.toLocaleString()} bits</strong></p>

          <div className="criteria-list" aria-label="Password strength criteria">
            {criteria.map(([label, met]) => (
              <div key={label} className={met ? "criterion criterion--met" : "criterion"}>
                <span className="criterion-icon" aria-hidden="true">{met ? <Check size={13} strokeWidth={3} /> : "—"}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {analysis.issues.length > 0 && (
            <div className="issue-summary">
              <p className="issue-summary__title">What to improve</p>
              <ul>
                {analysis.issues.map((issue) => <li key={issue.code}>{issue.message}</li>)}
              </ul>
            </div>
          )}

          {breachResult?.found && (
            <div className="urgent-note">
              <AlertTriangle size={17} aria-hidden="true" />
              <span>Use a password manager to generate a new, unique password, then enable two-factor authentication.</span>
            </div>
          )}
        </>
      )}
    </section>
  );
}
