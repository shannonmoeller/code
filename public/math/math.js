/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(value, min, max) {
  return value * (max - min) + min;
}

export function map(value, minA, maxA, minB, maxB) {
  return lerp(norm(value, minA, maxA), minB, maxB);
}

export function norm(value, min, max) {
  return (value - min) / (max - min);
}

export function round(value, multiple = 1) {
  return Math.round(value / multiple) * multiple || 0;
}

export function nextRandom(t) {
  // mulberry32
  // https://stackoverflow.com/a/47593316

  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  t = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

  return t;
}

export function createRandom(seed = 1) {
  return () => nextRandom((seed += 0x6d2b79f5));
}
