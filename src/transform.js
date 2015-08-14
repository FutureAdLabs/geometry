/* @flow -*- mode: flow -*- */

import * as point from "./point";
import * as anchor from "./anchor";
import * as trans from "./transform";

import type {Point} from "./point";
import type {Anchored} from "./anchor";

const p = point.point;
const u = anchor.unit;
const withA = anchor.anchored;

type Transform = {
  translate: Point;
  rotate: Anchored<number>; // degrees, not radians!
  scale: Anchored<Point>;
  opacity: number;
};

export function transform(t: Point, r: Anchored<number>, s: Anchored<Point>, o: number): Transform {
  if (arguments.length !== 4) {
    throw new Error("Invoked transform() with " + arguments.length + " arguments, was expecting 4. Did you mean translate()?");
  }
  return {
    translate: t,
    rotate: r,
    scale: s,
    opacity: o
  };
}

export const reset: Transform = transform(p(0, 0), u(0), u(p(1, 1)), 1);

export function translate(x: number, y: number): Transform {
  return transform(p(x, y), u(0), u(p(1, 1)), 1);
}

export function translatePoint(t: Point): Transform {
  return transform(t, u(0), u(p(1, 1)), 1);
}

export function rotate(a: number): Transform {
  return transform(p(0, 0), u(a), u(p(1, 1)), 1);
}

export function rotateAround(x: number, y: number, a: number): Transform {
  return transform(p(0, 0), withA(p(x, y), a), u(p(1, 1)), 1);
}

export function rotateAroundPoint(a: Point, angle: number): Transform {
  return transform(p(0, 0), withA(a, angle), u(p(1, 1)), 1);
}

function noScaleToZero(x, y) {
  if (x === 0) {
    throw new Error(`Division by zero! You're trying to scale to a ratio of x=${x} y=${y}`);
  }
  if (y === 0) {
    throw new Error(`Division by zero! You're trying to scale to a ratio of x=${x} y=${y}`);
  }
}

export function scale(x: number, y: number): Transform {
  noScaleToZero(x, y);
  return transform(p(0, 0), u(0), u(p(x, y)), 1);
}

export function scalePoint(s: Point): Transform {
  noScaleToZero(s.x, s.y);
  return transform(p(0, 0), u(0), u(s), 1);
}

export function scaleAround(x: number, y: number, sx: number, sy: number): Transform {
  noScaleToZero(sx, sy);
  return transform(p(0, 0), u(0), withA(p(x, y), p(sx, sy)), 1);
}

export function scaleAroundPoint(a: Point, s: Point): Transform {
  noScaleToZero(s.x, s.y);
  return transform(p(0, 0), u(0), withA(a, s), 1);
}

export function opacity(o: number): Transform {
  return transform(p(0, 0), u(0), u(p(1, 1)), o);
}

export function compose(t1: Transform, t2: Transform): Transform {
  return transform(
    point.addPoints(t1.translate, t2.translate),
    anchor.lift2((a, b) => a + b)(t1.rotate, t2.rotate),
    anchor.lift2(point.mulPoints)(t1.scale, t2.scale),
    t1.opacity * t2.opacity
  );
}

export function composeAll(ts: Array<Transform>): Transform {
  return ts.reduce(compose, reset);
}

function eqNum(a, b) {
  return Math.round(a) === Math.round(b);
}

export function equals(a: Transform, b: Transform): boolean {
  return eqNum(a.translate.x, b.translate.x) &&
      eqNum(a.translate.y, b.translate.y) &&
      eqNum(a.rotate.anchor.x, b.rotate.anchor.x) &&
      eqNum(a.rotate.anchor.y, b.rotate.anchor.y) &&
      eqNum(a.rotate.value, b.rotate.value) &&
      eqNum(a.scale.anchor.x, b.scale.anchor.x) &&
      eqNum(a.scale.anchor.y, b.scale.anchor.y) &&
      eqNum(a.scale.value.x, b.scale.value.x) &&
      eqNum(a.scale.value.y, b.scale.value.y) &&
      eqNum(a.opacity, b.opacity);
}
