/* @flow -*- mode: flow -*- */

import * as p from "./point";

export interface Anchored<A> {
  anchor: p.Point;
  value: A;
}

export function anchored<A>(anchor: p.Point, value: A): Anchored<A> {
  return { anchor, value };
}

export function unit<A>(value: A): Anchored<A> {
  return { anchor: p.point(0, 0), value };
}

export function eqAnchor<A>(a: Anchored<A>, b: Anchored<A>): boolean {
  return p.eqPoint(a.anchor, b.anchor) && (p.isPoint(a.value) && p.isPoint(b.value) ? p.eqPoint(a.value, b.value) : a.value === b.value)
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
