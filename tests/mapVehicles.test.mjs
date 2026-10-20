import { test } from "node:test";
import assert from "node:assert/strict";
import { vehicleSvg, waypointSvg, routeBearing } from "../src/lib/mapVehicleIcons.ts";

test("road heading points north, east, south and west correctly", () => {
  const o = {lat: 0, lng: 0};
  assert.equal(Math.round(routeBearing(o,{lat:1,lng:0})),0);
  assert.equal(Math.round(routeBearing(o,{lat:0,lng:1})),90);
  assert.equal(Math.round(routeBearing(o,{lat:-1,lng:0})),180);
  assert.equal(Math.round(routeBearing(o,{lat:0,lng:-1})),-90);
});
test("vehicle SVGs are vector silhouettes without emoji or sticker images", () => {
  for(const kind of ["bike","car","tow"]){
    const svg = vehicleSvg(kind,45);
    assert.match(svg,/^<svg /);
    assert.match(svg,/data-vehicle-heading="true"/);
    assert.match(svg,/rotate\(45 32 32\)/);
    assert.ok(!svg.includes("🛵") && !svg.includes("🚚"));
    assert.ok(!svg.includes("<image"));
  }
});
test("static waypoints have unique vector markers", () => {
  assert.notEqual(waypointSvg("pickup"), waypointSvg("passenger"));
  assert.notEqual(waypointSvg("workshop"), waypointSvg("passenger"));
});
