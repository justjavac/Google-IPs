"use strict";

const data = require("../data/google-ips.json");

const byCountry = freezeCountryMap(data.byCountry);
const countries = Object.freeze([...data.countries]);
const ips = Object.freeze([...data.ips]);
const ipToCountry = new Map();

for (const country of countries) {
  for (const ip of byCountry[country]) {
    ipToCountry.set(ip, country);
  }
}

function getByCountry(country) {
  assertCountry(country);
  return byCountry[country] || [];
}

function has(ip) {
  return typeof ip === "string" && ipToCountry.has(ip);
}

function findCountry(ip) {
  if (typeof ip !== "string") {
    return undefined;
  }

  return ipToCountry.get(ip);
}

function random(country) {
  const source = typeof country === "undefined" ? ips : getByCountry(country);
  if (source.length === 0) {
    return undefined;
  }

  return source[Math.floor(Math.random() * source.length)];
}

function freezeCountryMap(source) {
  const result = {};

  for (const country of Object.keys(source)) {
    result[country] = Object.freeze([...source[country]]);
  }

  return Object.freeze(result);
}

function assertCountry(country) {
  if (typeof country !== "string") {
    throw new TypeError("country must be a string");
  }
}

module.exports = {
  byCountry,
  countries,
  findCountry,
  getByCountry,
  has,
  ips,
  random,
};
