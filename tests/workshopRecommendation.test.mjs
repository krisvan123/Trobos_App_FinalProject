import { test } from "node:test";
import assert from "node:assert/strict";
import { rankDemoWorkshops, nearestDemoWorkshop } from "../src/lib/workshopRecommendation.ts";
const point=(name,lat,lng)=>({name,address:name,lat,lng});
const a=point("Near Jakarta", -6.21,106.81);
const b=point("South Jakarta", -6.28,106.80);
test("chooses workshop nearest passenger destination rather than origin",()=>{
  const destination=point("Passenger destination", -6.279,106.801);
  assert.equal(nearestDemoWorkshop(destination,[a,b])?.name,b.name);
  assert.equal(rankDemoWorkshops(destination,[a,b])[0].workshop.name,b.name);
});
test("returns none when no known workshop exists",()=>{
  assert.equal(nearestDemoWorkshop(a,[]),null);
});
test("distance sorted and invalid coordinates excluded",()=>{
  const far=point("Invalid",Infinity,0);
  const ranked=rankDemoWorkshops(a,[far,b,a]);
  assert.deepEqual(ranked.map(x=>x.workshop.name),[a.name,b.name]);
  assert.equal(ranked[0].distanceKm,0);
});
