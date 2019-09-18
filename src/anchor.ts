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
  return p.eqPoint(a.anchor, b.anchor) &&  // Anchors are always points, comparing them
  (p.isPoint(a.value) && p.isPoint(b.value) // If they are the same, check if value is point
    ? p.eqPoint(a.value, b.value) : // If value is point -> Check if they are equal
    a.value === b.value // Otherwise just do simple comparison
  );
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
