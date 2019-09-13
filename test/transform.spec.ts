import { expect } from "chai"

import * as t from "../src/transform";
import * as p from "../src/point";
import * as a from "../src/anchor";

function expectTransShape (maybeTrans) {
  expect(maybeTrans).to.have.to.have.keys(["translate", "rotate", "scale", "opacity"])
}

describe("transform", function() {
  describe("transform(translate: Point, rotate: Anchored<Deg>, scale: Anchored<Point>, opacity: number)", function () {
    it("Throws an error if you mix it up with `translate()` lol", function() {
      // @ts-ignore
      expect(t.transform.bind(null, 1, 2)).to.throw
    })

    it("Can generate a transform", function() {
      
      
      const translate = p.point(1, 1)
      const rotate = a.unit(180)
      const scale = a.unit(p.point(1, 1))
      const opacity = 123

      const transform = t.transform(translate, rotate, scale, opacity)

      expect(transform.translate).to.equal(translate)
      expect(transform.rotate).to.equal(rotate)
      expect(transform.scale).to.equal(scale)
      expect(transform.opacity).to.equal(opacity)

      expectTransShape(transform)
    })
  })

  describe("translate(x: number, y: number)", function() {
    it("Generates transform w/ translation", function () {
      const trans = t.translate(5, 5)
      const point = p.point(5, 5)
  
      expect(trans.translate).to.eql(point)
      expectTransShape(trans)
    })
  })

  describe("translatePoint(t: Point)", function() {
    it("generates transform w/ translation", function() {
        const point = p.point(5, 5)
        const trans = t.translatePoint(point)

        expect(trans.translate).to.equal(point)
        expectTransShape(trans)
    })
  })

  describe("rotate(a: Deg)", function() {
    it("generates transform w/ rotation", function () {
      const rot = 90
      const trans = t.rotate(rot)

      expect(trans.rotate.value).to.equal(rot)
      expectTransShape(trans)
    })
  })

  describe("rotateAround(x: number, y: number, a: Deg)", function() {
    it("generates transform w/ rotation", function () {
      const point = p.point(1, 2)
      const rot = 90

      const trans = t.rotateAround(1, 2, rot)

      expect(trans.rotate.value).to.equal(rot)
      expect(trans.rotate.anchor).to.eql(point)
      expectTransShape(trans)
    })
  })

  describe("rotateAroundPoint(a: Point, angle: Deg)", function() {
    it("generates transform w/ point rotation", function () {
      const point = p.point(1, 2)
      const rot = 90

      const trans = t.rotateAroundPoint(point, rot)

      expect(trans.rotate.value).to.equal(rot)
      expect(trans.rotate.anchor).to.equal(point)
      expectTransShape(trans)
    })
    
  })

  describe("ensureNoScaleToZero(p: Point)", function() {
    it("Makes sure point values aren't 0", function() {
      const point = p.point(0, 0)

      const noZeroPoint = t.ensureNoScaleToZero(point)

      expect(noZeroPoint.x).to.not.equal(0)
      expect(noZeroPoint.y).to.not.equal(0)
    })

    it("Doesn't touch other values", function() {
      const point = p.point(132, 13125)

      const noZeroPoint = t.ensureNoScaleToZero(point)

      expect(noZeroPoint).to.eql(point)
    })
  })

  describe("scale(x: number, y: number)", function() {
    it("generates transform w/ scale", function () {
      const point = p.point(1, 1)
      const trans = t.scale(1, 1)

      expect(trans.scale.value).to.eql(point)
      expectTransShape(trans)
    })
  })

  describe("scalePoint(s: Point)", function() {
    it("generates transform w/ point scale", function () {
      const point = p.point(1, 1)
      const trans = t.scalePoint(point)

      expect(trans.scale.value).to.eql(point)
      expectTransShape(trans)
    })
  })

  describe("scaleAround(x: number, y: number, sx: number, sy: number)", function() {
    it("generates transform w/ scale", function () {
      const point = p.point(1, 2)
      const scale = p.point(3, 4)

      const trans = t.scaleAround(1, 2, 3, 4)

      expect(trans.scale.value).to.eql(scale)
      expect(trans.scale.anchor).to.eql(point)
      expectTransShape(trans)
    })
  })
  describe("scaleAroundPoint(a: Point, s: Point)", function() {
    it("generates transform w/ point scale", function () {
      const point = p.point(1, 2)
      const scale = p.point(3, 4)

      const trans = t.scaleAroundPoint(point, scale)
      
      expect(trans.scale.value).to.eql(scale)
      expect(trans.scale.anchor).to.equal(point)
      expectTransShape(trans)
    })
  })

  describe("opacity(o: number)", function () {
    it("generates transform w/ opacity", function () {
      const opacity = 1

      const trans = t.opacity(opacity)

      expect(trans.opacity).to.equal(opacity)
      expectTransShape(trans)
    })
  })

  describe("compose(t1: Transform, t2: Transform)", function() {
    it("Can compose two translations", function() {

      const transform1 = t.transform(p.point(2, 3), a.unit(90), a.unit(p.point(5, 5)), 0.5)
      const transform2 = t.transform(p.point(3, 2), a.unit(90), a.unit(p.point(2, 2)), 0.5)
      
      const expectedTransform = {
        translate: { x: 5, y: 5 },
        rotate: { anchor: { x: 0, y: 0 }, value: 180 },
        scale: { anchor: { x: 0, y: 0 }, value: { x: 10, y: 10 } },
        opacity: 0.25
      }

      const trans = t.compose(transform1, transform2)

      expect(trans).to.deep.eq(expectedTransform)
    })
  })
  describe("composeAll(ts: Array<Transform>)", function() {
    it("Can compose three translations", function () {
      
      const transform1 = t.transform(p.point(2, 3), a.unit(90), a.unit(p.point(5, 5)), 0.5)
      const transform2 = t.transform(p.point(3, 2), a.unit(90), a.unit(p.point(2, 2)), 0.5)
      const transform3 = t.transform(p.point(5, 5), a.unit(90), a.unit(p.point(2, 2)), 2)

      const expectedTransform = {
        translate: { x: 10, y: 10 },
        rotate: { anchor: { x: 0, y: 0 }, value: 270 },
        scale: { anchor: { x: 0, y: 0 }, value: { x: 20, y: 20 } },
        opacity: 0.5
      }

      const trans = t.composeAll([transform1, transform2, transform3])

      expect(trans).to.deep.eq(expectedTransform)
    })
  })
  describe("equals(a: Transform, b: Transform)", function() {
    it("Can identify two equal transforms", function() {
      const transform1 = t.transform(p.point(3, 2), a.unit(90), a.unit(p.point(5, 5)), 0.5)
      const transform2 = t.transform(p.point(3, 2), a.unit(90), a.unit(p.point(5, 5)), 0.5)

      expect(t.equals(transform1, transform2)).to.be.true
    })
    it("Can identify two unequal transforms", function () {
      const transform1 = t.transform(p.point(2, 3), a.unit(90), a.unit(p.point(5, 5)), 0.5)
      const transform2 = t.transform(p.point(3, 2), a.unit(90), a.unit(p.point(2, 2)), 0.5)

      expect(t.equals(transform1, transform2)).to.be.false
    })
  })
})

