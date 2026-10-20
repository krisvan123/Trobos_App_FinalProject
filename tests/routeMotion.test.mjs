import {test} from "node:test";
import assert from "node:assert/strict";
import {prepareRoute,sampleRoute,sampleHeading} from "../src/lib/routeMotion.ts";
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-4,`${a} is not near ${b}`);
test("distance weighted interpolation across uneven segments",()=>{
 const r=prepareRoute([{lat:0,lng:0},{lat:0,lng:1},{lat:0,lng:4}]);
 near(sampleRoute(r,25).lng,1);near(sampleRoute(r,50).lng,2);near(sampleRoute(r,75).lng,3);
});
test("clamp progress including invalid values",()=>{
 const r=prepareRoute([{lat:0,lng:0},{lat:0,lng:3}]);
 near(sampleRoute(r,-20).lng,0);near(sampleRoute(r,120).lng,3);near(sampleRoute(r,NaN).lng,0);
});
test("road headings reflect road direction",()=>{
 near(sampleHeading(prepareRoute([{lat:0,lng:0},{lat:0,lng:1}]),50),90);
 near(sampleHeading(prepareRoute([{lat:0,lng:0},{lat:1,lng:0}]),50),0);
});
test("empty and repeated coordinate geometry are safe",()=>{
 assert.ok(Number.isFinite(sampleRoute(prepareRoute([]),50).lat));
 assert.deepEqual(sampleRoute(prepareRoute([{lat:1,lng:2},{lat:1,lng:2}]),50),{lat:1,lng:2});
});
