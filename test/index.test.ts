import assert from "node:assert/strict";
import test from "node:test";
import {
  byCountry,
  countries,
  findCountry,
  getByCountry,
  has,
  ips,
  random,
} from "../src";

test("exports the generated IP list", () => {
  assert.equal(ips.length, 4312);
  assert.equal(countries.length, 20);
  assert.equal(ips[0], "93.123.23.1");
  assert.equal(ips.at(-1), "118.174.25.251");
});

test("groups IPs by country", () => {
  assert.deepEqual(getByCountry("Bulgaria").slice(0, 3), [
    "93.123.23.1",
    "93.123.23.2",
    "93.123.23.3",
  ]);
  assert.equal(getByCountry("Taiwan").length, 1013);
  assert.deepEqual(getByCountry("Unknown"), []);
});

test("looks up IP membership and country", () => {
  assert.equal(has("93.123.23.1"), true);
  assert.equal(has("127.0.0.1"), false);
  assert.equal(has(127001), false);
  assert.equal(findCountry("118.174.25.251"), "Thailand");
  assert.equal(findCountry("127.0.0.1"), undefined);
  assert.equal(findCountry(null), undefined);
});

test("returns random IPs from all data or a country", () => {
  const originalRandom = Math.random;
  Math.random = () => 0;

  try {
    assert.equal(random(), "93.123.23.1");
    assert.equal(random("Bulgaria"), "93.123.23.1");
    assert.equal(random("Unknown"), undefined);
  } finally {
    Math.random = originalRandom;
  }
});

test("returns immutable data", () => {
  assert.throws(() => {
    (ips as string[]).push("127.0.0.1");
  }, TypeError);
  assert.throws(() => {
    (byCountry.Bulgaria as string[]).push("127.0.0.1");
  }, TypeError);
});

test("validates country input", () => {
  assert.throws(() => {
    getByCountry(123 as unknown as string);
  }, TypeError);
});
