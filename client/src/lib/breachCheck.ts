/**
 * Harbor Checkpoint privacy boundary: this module hashes locally and never
 * sends a full password or full SHA-1 hash over the network.
 */

const HIBP_RANGE_BASE_URL = "https://api.pwnedpasswords.com/range";

export type BreachCheckResult = {
  found: boolean;
  count: number;
};

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export function splitSha1Hash(fullHash: string) {
  const normalizedHash = fullHash.trim().toUpperCase();
  if (!/^[A-F0-9]{40}$/.test(normalizedHash)) {
    throw new Error("A SHA-1 hash must contain exactly 40 hexadecimal characters.");
  }

  return {
    prefix: normalizedHash.slice(0, 5),
    suffix: normalizedHash.slice(5),
  };
}

export function parseRangeResponse(responseText: string, expectedSuffix: string): BreachCheckResult {
  const normalizedSuffix = expectedSuffix.trim().toUpperCase();

  for (const line of responseText.split(/\r?\n/)) {
    const [suffix, count] = line.trim().split(":");
    if (suffix?.toUpperCase() === normalizedSuffix) {
      return { found: true, count: Number.parseInt(count, 10) || 0 };
    }
  }

  return { found: false, count: 0 };
}

/**
 * Queries the HIBP range endpoint with only five SHA-1 hash characters.
 * The suffix is kept on-device and compared against the returned candidates.
 */
export async function checkHashBreach(
  fullHash: string,
  fetcher: FetchLike = fetch,
): Promise<BreachCheckResult> {
  const { prefix, suffix } = splitSha1Hash(fullHash);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  let response: Response;

  try {
    response = await fetcher(`${HIBP_RANGE_BASE_URL}/${prefix}`, {
      headers: {
        "Add-Padding": "true",
      },
      signal: controller.signal,
    });
  } catch {
    throw new Error("The breach service could not be reached. Please try again.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error("The breach service could not be reached. Please try again.");
  }

  return parseRangeResponse(await response.text(), suffix);
}

export async function sha1Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export async function checkPasswordBreach(password: string): Promise<BreachCheckResult> {
  // The password remains in memory; only its five-character SHA-1 prefix is requested.
  const fullHash = await sha1Hex(password);
  return checkHashBreach(fullHash);
}
