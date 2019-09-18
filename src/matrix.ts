import * as point from "./point";

import { Point } from "./point";
import { Transform } from "./transform";

import { Rad, degToRad } from "./util/number"

export interface Matrix {
  a: number; b: number; c: number;
  p: number; q: number; r: number;
  u: number; v: number; w: number;
  o: number;
};

export function transform(a: number, b: number, c: number, p: number, q: number, r: number, u: number, v: number, w: number, o: number): Matrix {
  return {
    a: a, b: b, c: c,
    p: p, q: q, r: r,
    u: u, v: v, w: w,
    o: o
  };
}

export const reset = transform(1, 0, 0, 0, 1, 0, 0, 0, 1, 1)

export function translate(x: number, y: number): Matrix {
  return transform(1, 0, x, 0, 1, y, 0, 0, 1, 1);
}

export function translatePoint(p: Point): Matrix {
  return transform(1, 0, p.x, 0, 1, p.y, 0, 0, 1, 1);
}

export function rotate(a: Rad): Matrix {
  const c = Math.cos(a), s = Math.sin(a);
  return transform(c, -s, 0, s, c, 0, 0, 0, 1, 1);
}

export function rotateAround(x: number, y: number, a: Rad): Matrix {
  const r00 = Math.cos(a), r10 = Math.sin(a), r01 = -r10;
  return transform(r00, r01, x - (r00 * x) - (r01 * y), r10, r00, y - (r10 * x) - (r00 * y),
    0, 0, 1, 1);
}

export function rotateAroundPoint(p: Point, a: Rad): Matrix {
  const r00 = Math.cos(a), r10 = Math.sin(a), r01 = -r10;
  return transform(r00, r01, p.x - (r00 * p.x) - (r01 * p.y), r10, r00,
    p.y - (r10 * p.x) - (r00 * p.y),
    0, 0, 1, 1);
}

export function scale(x: number, y: number): Matrix {
  return transform(x, 0, 0, 0, y, 0, 0, 0, 1, 1);
}

export function scalePoint(p: Point): Matrix {
  return transform(p.x, 0, 0, 0, p.y, 0, 0, 0, 1, 1);
}

export function scaleAround(x: number, y: number, sx: number, sy: number): Matrix {
  return composeAll([
    translate(x, y),
    scale(sx, sy),
    translate(-x, -y)
  ]);
}

export function scaleAroundPoint(a: Point, s: Point): Matrix {
  return composeAll([
    translatePoint(a),
    scalePoint(s),
    translate(-a.x, -a.y)
  ]);
}

export function opacity(o: number): Matrix {
  return transform(1, 0, 0, 0, 1, 0, 0, 0, 1, o);
}

export function compose(t1: Matrix, t2: Matrix): Matrix {
  return transform((t1.a * t2.a) + (t1.b * t2.p) + (t1.c * t2.u),
    (t1.a * t2.b) + (t1.b * t2.q) + (t1.c * t2.v),
    (t1.a * t2.c) + (t1.b * t2.r) + (t1.c * t2.w),

    (t1.p * t2.a) + (t1.q * t2.p) + (t1.r * t2.u),
    (t1.p * t2.b) + (t1.q * t2.q) + (t1.r * t2.v),
    (t1.p * t2.c) + (t1.q * t2.r) + (t1.r * t2.w),

    (t1.u * t2.a) + (t1.v * t2.p) + (t1.w * t2.u),
    (t1.u * t2.b) + (t1.v * t2.q) + (t1.w * t2.v),
    (t1.u * t2.c) + (t1.v * t2.r) + (t1.w * t2.w),
    t1.o * t2.o);
}

export function composeAll(ts: Array<Matrix>): Matrix {
  return ts.reduce(compose, reset);
}

function determinant(t: Matrix): number {
  return (t.a * (t.q * t.w - t.r * t.v))
    - (t.b * (t.w * t.p - t.r * t.u))
    + (t.c * (t.p * t.v - t.q * t.u));
}

export function mulN(n: number, t: Matrix): Matrix {
  return transform(n * t.a, n * t.b, n * t.c, n * t.p, n * t.q, n * t.r, n * t.u, n * t.v, n * t.w, t.o);
}

export function inverse(t: Matrix): Matrix {
  const det = 1 / determinant(t);
  const tp = transform(
    t.q * t.w - t.r * t.v, 0 - (t.b * t.w - t.c * t.v), t.b * t.r - t.c * t.q,
    0 - (t.p * t.w - t.r * t.u), t.a * t.w - t.c * t.u, 0 - (t.a * t.r - t.c * t.p),
    t.p * t.v - t.q * t.u, 0 - (t.a * t.v - t.b * t.u), t.a * t.q - t.b * t.p,
    1 / t.o
  );
  return mulN(det, tp);
}

export function transformPoint(t: Matrix, p: Point): Point {
  return {
    x: t.a * p.x + t.b * p.y + t.c,
    y: t.p * p.x + t.q * p.y + t.r
  };
}

export function fromTransform(t: Transform): Matrix {
  return composeAll([
    translatePoint(t.translate),
    rotateAroundPoint(t.rotate.anchor, degToRad(t.rotate.value)),
    scaleAroundPoint(t.scale.anchor, t.scale.value),
    opacity(t.opacity)
  ]);
}

export function decompose(t: Matrix) {
  let row0x = t.a;
  let row0y = t.b;
  let row1x = t.p;
  let row1y = t.q;

  let translateX = t.c;
  let translateY = t.r;

  let scaleX = Math.sqrt(row0x * row0x + row0y * row0y);
  let scaleY = Math.sqrt(row1x * row1x + row1y * row1y);

  let det = row0x * row1y - row0y * row1x;
  if (det < 0) {
    if (row0x < row1y) {
      scaleX *= -1;
    } else {
      scaleY *= -1;
    }
  }

  if (scaleX) {
    row0x *= 1 / scaleX;
    row0y *= 1 / scaleX;
  }

  if (scaleY) {
    row1x *= 1 / scaleY;
    row1y *= 1 / scaleY;
  }

  let angle = -Math.atan2(row0y, row0x);

  let m11 = row0x;
  let m12 = row0y;
  let m21 = row1x;
  let m22 = row1y;
  let sn: number;
  let cs: number;

  if (angle) {
    sn = -row0y;
    cs = row0x;
    m11 = row0x;
    m12 = row0y;
    m21 = row1x;
    m22 = row1y;
    row0x = cs * m11 + sn * m21;
    row0y = cs * m12 + sn * m22;
    row1x = -sn * m11 + cs * m21;
    row1y = -sn * m12 + cs * m22;
  }

  return {
    translateX: translateX,
    translateY: translateY,
    scaleX: scaleX,
    scaleY: scaleY,
    angle: angle,
    opacity: t.o
  };
}
