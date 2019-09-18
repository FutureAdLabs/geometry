import * as a from "../src/anchor"
import { point } from "../src/point"

import chai = require("chai")
import sinon = require("sinon")
import sinonChai = require("sinon-chai")

chai.use(sinonChai)
const { expect } = chai

describe("Anchor", function(){
  describe("anchored(anchor, value)", function () {
    it("creates an anchor with shape { anchor, value }", function () {
      const anchored = a.anchored(point(1,1), "wowee")

      expect(anchored).to.have.keys(["anchor", "value"])
    })

    it("Passes through values, unaffected", function () {
      const anchorPoint = point(1,1)
      const value = { durst: "The Freddest" }

      const anchored = a.anchored(anchorPoint, value)

      expect(anchored.anchor).to.equal(anchorPoint)
      expect(anchored.value).to.equal(value)
    })
  })

  describe("unit(value)", function () {
    it("It creates anchor with value, at 0,0", function () {
      const anchorPoint = point(0,0)
      const value = { durst: "The Freddest" }

      const anchored = a.unit(value)

      expect(anchored.anchor).to.eql(anchorPoint)
      expect(anchored.value).to.equal(value)
    })
  })

  describe("lift(fn)", function () {
    it("creates a lifted function which is being applied to val", function () {
      const anchorPoint = point(0,0)
      const originalVal = { example: "The Freddest" }
      const liftedVal = { example: "gorp" }

      const liftFn = sinon.stub().returns(liftedVal)

      const anchor = a.unit(originalVal)

      const lift = a.lift(liftFn)
      const anchored = lift(anchor)

      expect(liftFn).to.be.calledWithExactly(originalVal)
      expect(anchored.anchor).to.eql(anchorPoint)
      expect(anchored.value).to.equal(liftedVal)
    })
  })
  describe("lift2(fn)", function () {
    it("creates a lifted 2-argument function which is being applied to val", function () {
      const anchorPoint = point(0, 0)
      
      const val1 = { example: "The Freddest" }
      const val2 = { example: "Second example" }

      const liftedVal = { example: "gorp" }

      const liftFn = sinon.stub().returns(liftedVal)

      const anchor1 = a.unit(val1)
      const anchor2 = a.unit(val2)

      const lift = a.lift2(liftFn)
      const anchored = lift(anchor1, anchor2)

      expect(liftFn).to.be.calledWithExactly(val1, val2)
      expect(anchored.anchor).to.eql(anchorPoint)
      expect(anchored.value).to.equal(liftedVal)
    })

    it("adds together the two anchors in lift", function() {
      const anchorPoint1 = point(2, 5)
      const anchorPoint2 = point(5, 2)

      const anchor1 = a.anchored(anchorPoint1, "foo")
      const anchor2 = a.anchored(anchorPoint2, "bar")

      const lift = a.lift2((a, b) => "foz")
      const anchored = lift(anchor1, anchor2)

      expect(anchored.anchor).to.eql(point(7, 7))
    })
  })

  describe("eqAnchor(a, b)", function () {
    it("It correctly compares two equal point-anchors", function () {

      const anchorPoint1 = point(8, 1)
      const anchorPoint2 = point(8, 1)

      const anchored1 = a.unit(anchorPoint1)
      const anchored2 = a.unit(anchorPoint2)

      expect(a.eqAnchor(anchored1, anchored2)).to.be.true
    })

    it("It correctly compares two unequal point-anchors", function () {

      const anchorPoint1 = point(8, 1)
      const anchorPoint2 = point(9, 2)

      const anchored1 = a.unit(anchorPoint1)
      const anchored2 = a.unit(anchorPoint2)

      expect(a.eqAnchor(anchored1, anchored2)).to.be.false
    })

    it("It correctly compares two equal primitive value-anchors", function () {

      const anchored1 = a.unit("ABC")
      const anchored2 = a.unit("ABC")

      expect(a.eqAnchor(anchored1, anchored2)).to.be.true
    })

    it("It correctly compares two unequal primitive value-anchors", function () {

      const anchored1 = a.unit("ABC")
      const anchored2 = a.unit("DEF")

      expect(a.eqAnchor(anchored1, anchored2)).to.be.false
    })

  })
})
