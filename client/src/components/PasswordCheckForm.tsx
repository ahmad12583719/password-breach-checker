/**
 * Harbor Checkpoint component style: direct, calm, and visibly private.
 * The password is controlled only in browser memory and is never logged here.
 */
import { Eye, EyeOff, KeyRound, Loader2, Radar } from "lucide-react";
import type { FormEvent } from "react";

type PasswordCheckFormProps = {
  password: string;
  showPassword: boolean;
  isChecking: boolean;
  disabled: boolean;
  onPasswordChange: (password: string) => void;
  onToggleVisibility: () => void;
  onSubmit: () => void;
};

export function PasswordCheckForm({
  password,
  showPassword,
  isChecking,
  disabled,
  onPasswordChange,
  onToggleVisibility,
  onSubmit,
}: PasswordCheckFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="assessment-form" aria-describedby="password-handoff-note">
      <div className="field-kicker">
        <KeyRound aria-hidden="true" size={15} strokeWidth={2.2} />
        <span>01 / LOCAL ANALYSIS</span>
      </div>
      <label className="form-label" htmlFor="password-input">
        Password to check
      </label>
      <div className="password-field-shell">
        <input
          id="password-input"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          autoComplete="new-password"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type or paste a password"
          className="password-input"
          aria-label="Password to check"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="visibility-button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
        </button>
      </div>
      <p id="password-handoff-note" className="field-note">
        Strength analysis starts in this browser. The breach lookup starts only when you choose to check exposure.
      </p>
      <button className="check-button" type="submit" disabled={disabled || isChecking}>
        {isChecking ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Radar size={18} aria-hidden="true" />}
        {isChecking ? "Checking exposure…" : "Check breach exposure"}
      </button>
    </form>
  );
}

