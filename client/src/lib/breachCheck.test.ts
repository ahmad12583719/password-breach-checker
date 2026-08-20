import { describe, expect, it, vi } from "vitest";
import { checkHashBreach, parseRangeResponse, splitSha1Hash } from "./breachCheck";

const knownSha1 = "5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8";

describe("k-anonymity breach lookup", () => {
  it("splits a SHA-1 hash into the five-character prefix and local suffix", () => {
    expect(splitSha1Hash(knownSha1)).toEqual({
      prefix: "5BAA6",
      suffix: "1E4C9B93F3F0682250B6CF8331B7EE68FD8",
    });
  });

  it("sends only the five-character prefix and matches the suffix locally", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response("1E4C9B93F3F0682250B6CF8331B7EE68FD8:42\r\nABCDEF:1", { status: 200 }),
    );

    await expect(checkHashBreach(knownSha1, fetcher)).resolves.toEqual({ found: true, count: 42 });
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.pwnedpasswords.com/range/5BAA6",
      expect.objectContaining({ headers: { "Add-Padding": "true" } }),
    );
    expect(JSON.stringify(fetcher.mock.calls)).not.toContain(knownSha1);
  });

  it("reports no match when the suffix is absent", () => {
    expect(parseRangeResponse("ABCDEF:7\n000000:2", "1E4C9B93F3F0682250B6CF8331B7EE68FD8")).toEqual({ found: false, count: 0 });
  });

  it("returns a plain-language error when the range service is unreachable", async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError("Network unavailable"));
    await expect(checkHashBreach(knownSha1, fetcher)).rejects.toThrow("The breach service could not be reached. Please try again.");
  });
});
