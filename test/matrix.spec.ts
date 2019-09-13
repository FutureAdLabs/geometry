import * as t from "../src/matrix";
import * as g from "../src/point";
import { assert } from "chai";

function genNum() {
  return (Math.random() * 10000) - 5000;
}

function eqNum(a, b) {
  return Math.round(a) === Math.round(b);
}

function genT() {
  return t.transform(genNum(), genNum(), genNum(), genNum(), genNum(), genNum(), genNum(), genNum(), genNum(), Math.random());
}

function eqT(a, b) {
  assert(eqNum(a.a, b.a) &&
         eqNum(a.b, b.b) &&
         eqNum(a.c, b.c) &&
         eqNum(a.p, b.p) &&
         eqNum(a.q, b.q) &&
         eqNum(a.r, b.r) &&
         eqNum(a.u, b.u) &&
         eqNum(a.v, b.v) &&
         eqNum(a.w, b.w) &&
         eqNum(a.o, b.o),
         "\n" + JSON.stringify(a) + "\ndoes not equal\n" + JSON.stringify(b));
}

function genP() {
  return g.point(genNum(), genNum());
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

describe("Matrix", () => {
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

  check("plus inverse of transform equals reset transform", () => {
    const a = genT(), ia = t.inverse(a);
    eqT(t.compose(a, ia), t.reset);
  });

  check("plus transform b plus inverse of transform b equals transform", () => {
    const a = genT(), b = genT(), ib = t.inverse(b);
    eqT(t.compose(t.compose(a, b), ib), a);
  });

  check("still forms a semigroup when applied to points", () => {
    const a = genT(), b = genT(), p = genP(),
        ap = t.transformPoint(a, p), bp = t.transformPoint(b, p);
    eqP(g.addPoints(ap, bp), g.addPoints(bp, ap));
  });

  check("Decomposes to correct components", () => {
    const translateX = genNum();
    const translateY = genNum();
    const scaleX = genNum();
    const scaleY = genNum();
    const angle = genNum();
    const opacity = Math.random();
    const p = g.point(genNum(), genNum());

    const composed = t.compose(t.compose(t.compose(
       t.translate(translateX, translateY),
       t.scale(scaleX, scaleY)),
       t.rotate(angle)),
       t.opacity(opacity));

    const decomposed = t.decompose(composed);

    const recomposed = t.compose(t.compose(t.compose(
       t.translate(decomposed.translateX, decomposed.translateY),
       t.scale(decomposed.scaleX, decomposed.scaleY)),
       t.rotate(decomposed.angle)),
       t.opacity(decomposed.opacity));

    const p1 = t.transformPoint(composed, p);
    const p2 = t.transformPoint(recomposed, p);

    assert(eqNum(p1.x, p2.x) &&
      eqNum(p1.y, p2.y) &&
      eqNum(opacity, decomposed.opacity));
  });
});
