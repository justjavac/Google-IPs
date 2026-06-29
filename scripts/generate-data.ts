import fs from "node:fs";
import path from "node:path";

interface GoogleIpsData {
  countries: string[];
  ips: string[];
  byCountry: Record<string, string[]>;
}

const root = path.resolve(__dirname, "..", "..");
const readmePath = path.join(root, "README.md");
const outputPath = path.join(root, "data", "google-ips.json");

const html = fs.readFileSync(readmePath, "utf8");
const countryBlocks = html.split(/<th[^>]*>/i).slice(1);
const byCountry: Record<string, string[]> = {};
const countries: string[] = [];
const ips: string[] = [];
const ipSet = new Set<string>();
const countryIpSets = new Map<string, Set<string>>();

for (const block of countryBlocks) {
  const countryMatch = block.match(/^([^<]+)<\/th>/i);
  if (!countryMatch) {
    continue;
  }

  const country = decodeHtml(countryMatch[1].trim());
  let countryIps = byCountry[country];
  let countryIpSet = countryIpSets.get(country);

  if (!countryIps || !countryIpSet) {
    countryIps = [];
    countryIpSet = new Set<string>();
    byCountry[country] = countryIps;
    countryIpSets.set(country, countryIpSet);
    countries.push(country);
  }

  const section = block.split(/<th[^>]*>/i)[0];
  const matches = section.matchAll(
    /<a\s+href="http:\/\/(\d{1,3}(?:\.\d{1,3}){3})"[^>]*>\1<\/a>/gi,
  );

  for (const match of matches) {
    const ip = match[1];
    assertIpv4(ip);

    if (!countryIpSet.has(ip)) {
      countryIpSet.add(ip);
      countryIps.push(ip);
    }

    if (!ipSet.has(ip)) {
      ipSet.add(ip);
      ips.push(ip);
    }
  }
}

if (countries.length === 0 || ips.length === 0) {
  throw new Error("No countries or IP addresses were found in README.md.");
}

const data: GoogleIpsData = { countries, ips, byCountry };

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(`Generated ${outputPath}`);
console.log(`${ips.length} IPs across ${countries.length} countries`);

function assertIpv4(ip: string): void {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => octet < 0 || octet > 255)) {
    throw new Error(`Invalid IPv4 address: ${ip}`);
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}
