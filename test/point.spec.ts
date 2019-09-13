import * as p from "../src/point"
import { expect } from "chai"

describe("Point", function() {
  describe("point(x, y)", function() {
    it("creates an object with shape { x, y }", function () {
      const point = p.point(1, 1)

      expect(point).to.have.keys(["x", "y"])
    })
  })

  describe("isPoint(x, y)", function() {
    it("{x: 1, y: 1} is point", function () {
      const point = {x: 1, y: 1}

      expect(p.isPoint(point)).to.be.true
    })

    it("null is no point", function () {
      const point = null

      expect(p.isPoint(point)).to.be.false
    })

    it("{x: 1, y: 'bla'} is no point", function () {
      const point = { x: 1, y: 'bla' }

      expect(p.isPoint(point)).to.be.false
    })

    it("{x: 'wow', y: 1} is no point", function () {
      const point = { x: 'wow', y: 1 }

      expect(p.isPoint(point)).to.be.false
    })
    
    it("{x: 1, y: 1, z: 1} is no point", function () {
      const point = { x: 1, y: 1, z: 1 }

      expect(p.isPoint(point)).to.be.false
    })
  })

  describe("addPoints(a, b)", function() {
    it("can add together two points", function () {
      const a = p.point(2, 2)
      const b = p.point(3, 3)

      // 2 + 3 = 5?
      expect(p.addPoints(a, b)).to.eql(p.point(5, 5))
    })

    it("can add a number to a point", function () {
      const a = p.point(2, 2)
      const b = 3

      // 2 + 3 = 5?
      expect(p.addPoints(a, b)).to.eql(p.point(5, 5))
    })
  })

  describe("subPoints(a, b)", function() {
    it("can subtract one point with another", function () {
      const a = p.point(5, 5)
      const b = p.point(2, 2)

      // 5 -  2 = 3
      expect(p.subPoints(a, b)).to.eql(p.point(3, 3))
    })
    it("can subtract one point with a number", function () {
      const a = p.point(5, 5)
      const b = 2

      // 5 -  2 = 3
      expect(p.subPoints(a, b)).to.eql(p.point(3, 3))
    })
  })

  describe("mulPoints(a, b)", function() {
    it("can multiply one point with another", function () {
      const a = p.point(5, 5)
      const b = p.point(2, 2)

      // 5 * 2 = 10
      expect(p.mulPoints(a, b)).to.eql(p.point(10, 10))
    })
    it("can multiply a point with a number", function () {
      const a = p.point(5, 5)
      const b = 2

      // 5 * 2 = 10
      expect(p.mulPoints(a, b)).to.eql(p.point(10, 10))
    })
  })

  describe("divPoint(a, b)", function() {
    it("can divide two points with each other", function () {
    const a = p.point(10, 10)
    const b = p.point(2, 2)

      // 10 / 2 = 5
      expect(p.divPoint(a, b)).to.eql(p.point(5, 5))
    })
    it("can divide one point with number", function () {
      const a = p.point(10, 10)
      const b = 2

      // 10 / 2 = 5
      expect(p.divPoint(a, b)).to.eql(p.point(5, 5))
    })
  })

})


describe("Bounds", function () {
  describe("boundsFor(a, b, d)", function () {
    it("creates an object with shape { ax, ay, bx, by, dx, dy }", function () {

      const a = p.point(0,0)
      const b = p.point(1,0)
      const d = p.point(0,1)

      // So from "point.ts"
      // Bounds are represented by three points A, B and D such that:
      //     0,0 A---B 1,0
      //         |   |
      //     0,1 D---C 1,1 <--- Inferred
      // Given that bounds are always rectangles, the missing point C can be inferred.

      const bounds = p.boundsFor(a, b, d)

      expect(bounds).to.have.keys(["ax", "ay", "bx", "by", "dx", "dy"])
    })
  })

  describe("bc(b)", function () {
    it("Inferres the correct bounds for Bounds-C", function () {

      const a = p.point(0,0)
      const b = p.point(1,0)
      const d = p.point(0,1)

      const bounds = p.boundsFor(a, b, d)
      // See above for explanation
      const boundsC = p.bc(bounds)

      expect(boundsC).to.eql(p.point(1, 1))
    })
  })

  describe("axisAligned(b)", function () {
    it("Correctly identifies two aligning axis", function () {

      const a = p.point(0, 0)
      const b = p.point(1, 0)
      const d = p.point(0, 1)

      const bounds = p.boundsFor(a, b, d)
      
      // b.ax === b.dx && b.ay === b.by
      const isAligned = p.axisAligned(bounds)

      expect(isAligned).to.be.true
    })
    it("Correctly identifies non-aligned bounds", function () {

      const a = p.point(0, 0)
      const b = p.point(6, 0)
      const d = p.point(-1, 2)
      

      // This is an example of what that looks like:
      //     0,0 A-----B 6,0
      //        /     /
      //       /     /
      // -1,2 D-----C 5,2
      // (not to scale lol)

      const bounds = p.boundsFor(a, b, d)
      
      const isAligned = p.axisAligned(bounds)

      expect(isAligned).to.be.false
    })
  })

  describe("pointInBounds(b: Bounds, p: Point)", function () {
    it("Can identify point inside perfect square", function () {

      const a = p.point(0, 0)
      const b = p.point(5, 0)
      const d = p.point(0, 5)

      const bounds = p.boundsFor(a, b, d)
      const point = p.point(2,2)


      expect(p.pointInBounds(bounds, point)).to.be.true
    })

    it("Can identify point outside perfect square", function () {

      const a = p.point(0, 0)
      const b = p.point(5, 0)
      const d = p.point(0, 5)

      const bounds = p.boundsFor(a, b, d)
      const point = p.point(10, 2)


      expect(p.pointInBounds(bounds, point)).to.be.false
    })

    it("Can identify point inside non-aligned bounds", function () {

      const a = p.point(0, 0)
      const b = p.point(6, 0)
      const d = p.point(-5, 5)

      const bounds = p.boundsFor(a, b, d)
      const point = p.point(1, 2)


      expect(p.pointInBounds(bounds, point)).to.be.true
    })

    it("Can identify point outside non-aligned bounds", function () {

      const a = p.point(0, 0)
      const b = p.point(6, 0)
      const d = p.point(-1, 2)

      const bounds = p.boundsFor(a, b, d)
      const point = p.point(7, 0)


      expect(p.pointInBounds(bounds, point)).to.be.false
    })
  })

  describe("containsBounds(b1, b2)", function () {
    it("Can identify bounds completely contained by another set of bounds", function () {

      // Like this:
      //  A -------- B
      //  |  * -- *  |
      //  |  |    |  |
      //  |  |    |  |
      //  |  * -- *  |
      //  |          |
      //  D -------- C


      // Outside
      const a_out = p.point(0, 0)
      const b_out = p.point(10, 0)
      const d_out = p.point(0, 10)

      // Inside
      const a_in = p.point(2, 2)
      const b_in = p.point(4, 2)
      const d_in = p.point(2, 4)


      const bounds_out = p.boundsFor(a_out, b_out, d_out)
      const bounds_in = p.boundsFor(a_in, b_in, d_in)

      expect(p.containsBounds(bounds_out, bounds_in)).to.be.true
    })
    
    it("Can identify bounds not contained by another set of bounds", function () {

      // Outside
      const a_out = p.point(0, 0)
      const b_out = p.point(10, 0)
      const d_out = p.point(0, 10)

      // Inside
      const a_in = p.point(2, 2)
      const b_in = p.point(12, 2)
      const d_in = p.point(2, 12)


      const bounds_out = p.boundsFor(a_out, b_out, d_out)
      const bounds_in = p.boundsFor(a_in, b_in, d_in)

      expect(p.containsBounds(bounds_out, bounds_in)).to.be.false
    })
  })

})

describe("intersectsBounds(b1, b2)", function () {
    it("Can identify bounds intersecting another set of bounds", function () {

      // Like this:
      //  A -------- B
      //  |  * ------+-- *
      //  |  |       |   |
      //  |  |       |   |
      //  |  * ------+-- *
      //  |          |
      //  D -------- C


      // Outside
      const a_out = p.point(0, 0)
      const b_out = p.point(10, 0)
      const d_out = p.point(0, 10)

      // Inside
      const a_in = p.point(2, 2)
      const b_in = p.point(4, 2)
      const d_in = p.point(2, 4)


      const bounds_out = p.boundsFor(a_out, b_out, d_out)
      const bounds_in = p.boundsFor(a_in, b_in, d_in)

      expect(p.containsBounds(bounds_out, bounds_in)).to.be.true
    })
  
})
