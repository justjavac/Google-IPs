"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const googleIps = require("../src");

test("exports the generated IP list", () => {
  assert.equal(googleIps.ips.length, 4312);
  assert.equal(googleIps.countries.length, 20);
  assert.equal(googleIps.ips[0], "93.123.23.1");
  assert.equal(googleIps.ips.at(-1), "118.174.25.251");
});

test("groups IPs by country", () => {
  assert.deepEqual(googleIps.getByCountry("Bulgaria").slice(0, 3), [
    "93.123.23.1",
    "93.123.23.2",
    "93.123.23.3",
  ]);
  assert.equal(googleIps.getByCountry("Taiwan").length, 1013);
  assert.deepEqual(googleIps.getByCountry("Unknown"), []);
});

test("looks up IP membership and country", () => {
  assert.equal(googleIps.has("93.123.23.1"), true);
  assert.equal(googleIps.has("127.0.0.1"), false);
  assert.equal(googleIps.findCountry("118.174.25.251"), "Thailand");
  assert.equal(googleIps.findCountry("127.0.0.1"), undefined);
});

test("returns immutable data", () => {
  assert.throws(() => googleIps.ips.push("127.0.0.1"), TypeError);
  assert.throws(() => googleIps.byCountry.Bulgaria.push("127.0.0.1"), TypeError);
});
