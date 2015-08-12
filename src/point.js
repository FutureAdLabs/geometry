/* @flow -*- mode: flow -*- */

type Point = {
  x: number;
  y: number;
};

export function point(x: number, y: number): Point {
  return { x: x, y: y };
}

export function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subPoints(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function mulPoints(a: Point, b: Point): Point {
  return { x: a.x * b.x, y: a.y * b.y };
}

export function divPoint(a: Point, b: number): Point {
  return { x: a.x / b, y: a.y / b };
}

// Bounds are represented by three points A, B and D such that:
//     A---B
//     |   |
//     D---C
// Given that bounds are always rectangles, the missing point C can be inferred.
type Bounds = {
  ax: number; ay: number;
  bx: number; by: number;
  dx: number; dy: number;
};

export function boundsFor(a: Point, b: Point, d: Point): Bounds {
  return { ax: a.x, ay: a.y, bx: b.x, by: b.y, dx: d.x, dy: d.y };
}

function ba(b: Bounds): Point {
  return point(b.ax, b.ay);
}

function bb(b: Bounds): Point {
  return point(b.bx, b.by);
}

function bc(b: Bounds): Point {
  return point(b.dx + (b.bx - b.ax), b.dy + (b.by - b.ay));
}

function bd(b: Bounds): Point {
  return point(b.dx, b.dy);
}

function axisAligned(b: Bounds): boolean {
  return b.ax === b.dx && b.ay === b.by;
}

export function pointInBounds(b: Bounds, p: Point): boolean {
  if (axisAligned(b)) {
    return b.ax <= p.x && b.ay <= p.y && p.x <= b.bx && p.y <= b.dy;
  } else {
    const bax = b.bx - b.ax;
    const bay = b.by - b.ay;
    const dax = b.dx - b.ax;
    const day = b.dy - b.ay;
    const ab = (p.x - b.ax) * bax + (p.y - b.ay) * bay;
    const bbp = (p.x - b.bx) * bax + (p.y - b.by) * bay;
    const ad = (p.x - b.ax) * dax + (p.y - b.ay) * day;
    const dd = (p.x - b.dx) * dax + (p.y - b.dy) * day;
    return !(ab < 0 || bbp > 0 || ad < 0 || dd > 0);
  }
}

// Test whether b2 is completely contained by b1
export function containsBounds(b1: Bounds, b2: Bounds): boolean {
  return (pointInBounds(b1, ba(b2))
          && pointInBounds(b1, bb(b2))
          && pointInBounds(b1, bc(b2))
          && pointInBounds(b1, bd(b2)));
}

// Test whether b1 and b2 intersect
// FIXME algorithm below does not account for this case:
//     +--+
//     |  |
//  +--+--+--+
//  |  |  |  |
//  +--+--+--+
//     |  |
//     +--+
// Proper algorithm should test for whether any of the bounds'
// component lines intersect with each other.
export function intersectsBounds(b1: Bounds, b2: Bounds): boolean {
  return (pointInBounds(b1, ba(b2))
          || pointInBounds(b1, bb(b2))
          || pointInBounds(b1, bc(b2))
          || pointInBounds(b1, bd(b2))
          || pointInBounds(b2, ba(b1))
          || pointInBounds(b2, bb(b1))
          || pointInBounds(b2, bc(b1))
          || pointInBounds(b2, bd(b1)));
}
