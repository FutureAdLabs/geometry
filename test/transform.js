/*global describe, it */

import assert from "assert";

import * as t from "../src/transform";
import * as g from "../src/point";
import * as anchor from "../src/anchor";

function genNum() {
  return (Math.random() * 10000) - 5000;
}

function eqNum(a, b) {
  return Math.round(a) === Math.round(b);
}

function genP() {
  return g.point(genNum(), genNum());
}

function genT() {
  return t.transform(genP(), anchor.anchored(genP(), genNum()), anchor.anchored(genP(), genP()), Math.random());
}

function eqT(a, b) {
  assert(t.equals(a, b),
         "\n" + JSON.stringify(a) + "\ndoes not equal\n" + JSON.stringify(b));
}

function eqP(a, b) {
  assert(eqNum(a.x, b.x) &&
         eqNum(a.y, b.y),
         "\n" + JSON.stringify(a) + "\ndoes not equal\n" + JSON.stringify(b));
}

function check(desc, fn) {
  it(desc, () => {
    let i = 0;
    for (; i < 1000; i++) {
      fn();
    }
  });
}

describe("transform", () => {
  check("can be successfully compared to itself", () => {
    const a = genT();
    eqT(a, a);
  });

  check("forms a semigroup", () => {
    const a = genT(), b = genT(), c = genT();
    eqT(t.compose(a, t.compose(b, c)),
        t.compose(t.compose(a, b), c));
  });

  check("forms a monoid", () => {
    const a = genT();
    eqT(t.compose(a, t.reset), a);
  });
});
