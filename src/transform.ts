import * as point from "./point";
import * as anchor from "./anchor";

import { Point, eqPoint } from "./point";
import { Anchored, eqAnchor } from "./anchor";
import { eqNum, Deg } from "./util/number";

const p = point.point;
const u = anchor.unit;
const withA = anchor.anchored;

export interface Transform {
  translate: Point;
  rotate: Anchored<Deg>;
  scale: Anchored<Point>;
  opacity: number;
};


export function transform(translate: Point, rotate: Anchored<Deg>, scale: Anchored<Point>, opacity: number): Transform {
  if (arguments.length !== 4) {
    throw new Error("Invoked transform() with " + arguments.length + " arguments, was expecting 4. Did you mean translate(x, y)?");
  }
  return {
    translate,
    rotate,
    scale,
    opacity
  }
}

export const reset: Transform = transform(p(0, 0), u(0), u(p(1, 1)), 1);

export function translate(x: number, y: number): Transform {
  return transform(p(x, y), u(0), u(p(1, 1)), 1);
}

export function translatePoint(t: Point): Transform {
  return transform(t, u(0), u(p(1, 1)), 1);
}

export function rotate(a: Deg): Transform {
  return transform(p(0, 0), u(a), u(p(1, 1)), 1);
}

export function rotateAround(x: number, y: number, a: Deg): Transform {
  return transform(p(0, 0), withA(p(x, y), a), u(p(1, 1)), 1);
}

export function rotateAroundPoint(a: Point, angle: Deg): Transform {
  return transform(p(0, 0), withA(a, angle), u(p(1, 1)), 1);
}

export function ensureNoScaleToZero(p: Point): Point  {
  let { x, y } = p

  if(x === 0) { x = 0.001 }
  if(y === 0) { y = 0.001 }
  
  return { x, y }
}

export function scale(x: number, y: number): Transform {
  let result = ensureNoScaleToZero(p(x, y));
  return transform(p(0, 0), u(0), u(p(result.x, result.y)), 1);
}

export function scalePoint(s: Point): Transform {
  let result = ensureNoScaleToZero(s);
  return transform(p(0, 0), u(0), u(p(result.x, result.y)), 1);
}

export function scaleAround(x: number, y: number, sx: number, sy: number): Transform {
  let result = ensureNoScaleToZero(p(sx, sy));
  return transform(p(0, 0), u(0), withA(p(x, y), p(result.x, result.y)), 1);
}

export function scaleAroundPoint(a: Point, s: Point): Transform {
  let result = ensureNoScaleToZero(s);
  return transform(p(0, 0), u(0), withA(a, p(result.x, result.y)), 1);
}

export function opacity(o: number): Transform {
  return transform(p(0, 0), u(0), u(p(1, 1)), o);
}

export function compose(t1: Transform, t2: Transform): Transform {
  return transform(
    point.addPoints(t1.translate, t2.translate),
    anchor.lift2((a: Deg, b: Deg) => a + b)(t1.rotate, t2.rotate),
    anchor.lift2((a: Point, b: Point) => point.mulPoints(a, b))(t1.scale, t2.scale),
    t1.opacity * t2.opacity,
  );
}

export function composeAll(ts: Array<Transform>): Transform {
  return ts.reduce(compose, reset);
}

export function equals(a: Transform, b: Transform): boolean {
  return eqPoint(a.translate, b.translate) && 
    eqAnchor(a.rotate, b.rotate) &&
    eqAnchor(a.scale, b.scale) &&
    eqNum(a.opacity, b.opacity)
}
