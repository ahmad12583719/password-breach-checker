/**
 * Harbor Checkpoint implementation note: local analysis only.
 * This module never persists or transmits the password it receives.
 */
import commonPasswordsRaw from "./common-passwords.txt?raw";

export type StrengthRating = "Weak" | "Fair" | "Strong" | "Very Strong";

export type PasswordIssue = {
  code: "common" | "sequential" | "repeated" | "keyboard" | "short";
  message: string;
};

export type PasswordAnalysis = {
  entropy: number;
  score: number;
  rating: StrengthRating;
  issues: PasswordIssue[];
  criteria: {
    length: boolean;
    mixedCase: boolean;
    number: boolean;
    symbol: boolean;
    uncommon: boolean;
  };
};

const COMMON_PASSWORDS = new Set(
  commonPasswordsRaw
    .split(/\r?\n/)
    .map((entry) => entry.trim().toLocaleLowerCase())
    .filter(Boolean),
);

const KEYBOARD_WALKS = [
  "qwerty",
  "asdf",
  "zxcv",
  "qaz",
  "wsx",
  "edc",
  "rfv",
  "tgb",
  "yhn",
  "ujm",
  "12345",
  "09876",
];

function containsSequentialCharacters(value: string) {
  const characters = [...value.toLocaleLowerCase()];

  for (let index = 0; index <= characters.length - 3; index += 1) {
    const first = characters[index].charCodeAt(0);
    const second = characters[index + 1].charCodeAt(0);
    const third = characters[index + 2].charCodeAt(0);

    if (
      (second - first === 1 && third - second === 1) ||
      (second - first === -1 && third - second === -1)
    ) {
      return true;
    }
  }

  return false;
}

function containsKeyboardWalk(value: string) {
  const lowered = value.toLocaleLowerCase();
  return KEYBOARD_WALKS.some(
    (walk) => lowered.includes(walk) || lowered.includes([...walk].reverse().join("")),
  );
}

function characterPoolSize(value: string) {
  let pool = 0;
  if (/[a-z]/.test(value)) pool += 26;
  if (/[A-Z]/.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^\p{L}\p{N}\s]/u.test(value)) pool += 33;
  if (/[^\x00-\x7F]/.test(value)) pool += 100;
  return Math.max(pool, 1);
}

/**
 * Scores a password only in memory. The score is advisory—not a cryptographic
 * proof of safety—and common or predictable patterns meaningfully reduce it.
 */
export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      entropy: 0,
      score: 0,
      rating: "Weak",
      issues: [],
      criteria: {
        length: false,
        mixedCase: false,
        number: false,
        symbol: false,
        uncommon: false,
      },
    };
  }

  const isCommon = COMMON_PASSWORDS.has(password.toLocaleLowerCase());
  const hasSequence = containsSequentialCharacters(password);
  const hasRepeated = /(.)\1{2,}/u.test(password);
  const hasKeyboardPattern = containsKeyboardWalk(password);
  const hasLower = /\p{Ll}/u.test(password);
  const hasUpper = /\p{Lu}/u.test(password);
  const hasNumber = /\p{N}/u.test(password);
  const hasSymbol = /[^\p{L}\p{N}\s]/u.test(password);
  const length = [...password].length;
  const diversity = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  const uniqueRatio = new Set([...password]).size / Math.max(length, 1);
  const rawEntropy = length * Math.log2(characterPoolSize(password));
  const issues: PasswordIssue[] = [];

  if (length < 12) {
    issues.push({ code: "short", message: "Use at least 12 characters for more breathing room." });
  }
  if (isCommon) {
    issues.push({ code: "common", message: "This appears in the bundled list of 10,000 common passwords." });
  }
  if (hasSequence) {
    issues.push({ code: "sequential", message: "It contains a predictable sequence." });
  }
  if (hasRepeated) {
    issues.push({ code: "repeated", message: "It repeats the same character several times." });
  }
  if (hasKeyboardPattern) {
    issues.push({ code: "keyboard", message: "It includes a familiar keyboard walk." });
  }

  let score = Math.min(length / 16, 1) * 38;
  score += diversity * 8;
  score += Math.min(rawEntropy / 90, 1) * 20;
  score += uniqueRatio * 10;

  if (length >= 20) score += 4;
  if (isCommon) score -= 70;
  if (hasSequence) score -= 14;
  if (hasRepeated) score -= 18;
  if (hasKeyboardPattern) score -= 20;
  if (length < 8) score -= 12;

  const roundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const rating: StrengthRating =
    isCommon || roundedScore < 32
      ? "Weak"
      : roundedScore < 56
        ? "Fair"
        : roundedScore < 78
          ? "Strong"
          : "Very Strong";

  return {
    entropy: Math.round(rawEntropy * 10) / 10,
    score: roundedScore,
    rating,
    issues,
    criteria: {
      length: length >= 12,
      mixedCase: hasLower && hasUpper,
      number: hasNumber,
      symbol: hasSymbol,
      uncommon: !isCommon,
    },
  };
}

