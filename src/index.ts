import data from "../data/google-ips.json";

interface GoogleIpsData {
  countries: string[];
  ips: string[];
  byCountry: Record<string, string[]>;
}

const googleIpsData = data as GoogleIpsData;
const emptyIps: readonly string[] = Object.freeze([]);

export const byCountry: Readonly<Record<string, readonly string[]>> = freezeCountryMap(
  googleIpsData.byCountry,
);
export const countries: readonly string[] = Object.freeze([...googleIpsData.countries]);
export const ips: readonly string[] = Object.freeze([...googleIpsData.ips]);

const ipToCountry = new Map<string, string>();

for (const country of countries) {
  for (const ip of byCountry[country] ?? emptyIps) {
    ipToCountry.set(ip, country);
  }
}

export function getByCountry(country: string): readonly string[] {
  assertCountry(country);
  return byCountry[country] ?? emptyIps;
}

export function has(ip: string): boolean {
  return typeof ip === "string" && ipToCountry.has(ip);
}

export function findCountry(ip: string): string | undefined {
  if (typeof ip !== "string") {
    return undefined;
  }

  return ipToCountry.get(ip);
}

export function random(country?: string): string | undefined {
  const source = typeof country === "undefined" ? ips : getByCountry(country);
  if (source.length === 0) {
    return undefined;
  }

  return source[Math.floor(Math.random() * source.length)];
}

function freezeCountryMap(
  source: Record<string, readonly string[]>,
): Readonly<Record<string, readonly string[]>> {
  const result: Record<string, readonly string[]> = {};

  for (const [country, countryIps] of Object.entries(source)) {
    result[country] = Object.freeze([...countryIps]);
  }

  return Object.freeze(result);
}

function assertCountry(country: unknown): asserts country is string {
  if (typeof country !== "string") {
    throw new TypeError("country must be a string");
  }
}
