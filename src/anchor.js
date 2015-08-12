/* @flow -*- mode: flow -*- */

import * as p from "./point";

type Anchored<A> = {
  anchor: Point;
  value: A;
};

export function anchored<A>(anchor: Point, value: A): Anchored<A> {
  return { anchor, value };
}

export function unit<A>(value: A): Anchored<A> {
  return { anchor: p.point(0, 0), value };
}

export function lift<A>(fn: (a: A) => A): (a: Anchored<A>) => Anchored<A> {
  return (a) => ({
    anchor: a.anchor,
    value: fn(a.value)
  });
}

export function lift2<A>(fn: (a: A, b: A) => A): (a1: Anchored<A>, a2: Anchored<A>) => Anchored<A> {
  return (ap, bp) => ({
    anchor: p.addPoints(ap.anchor, bp.anchor),
    value: fn(ap.value, bp.value)
  });
}
