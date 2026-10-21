import { test } from "node:test";
import assert from "node:assert/strict";
import { advanceDemoTimeline, demoVisualProgress, DEMO_DURATIONS } from "../src/lib/demoTimeline.ts";
const base = {
  status:"TRIP_STARTED", userProgressPercent:0, carProgressPercent:0,
  userEtaMinutes:2, carEtaMinutes:3, travelStartedAt:1000,
};
test("smooth passenger and car progress have distinct travel durations",()=>{
  const t=advanceDemoTimeline(base,56000).trip;
  assert.equal(t.userProgressPercent,50);
  assert.ok(t.carProgressPercent<50);
  assert.equal(t.status,"TRIP_STARTED");
});
test("navigation and refresh resume from absolute start without resetting",()=>{
  const t=advanceDemoTimeline(base,33000).trip;
  const after=advanceDemoTimeline(t,91000).trip;
  assert.ok(after.userProgressPercent>t.userProgressPercent);
  assert.equal(after.travelStartedAt,1000);
});
test("skip passenger preserves the other vehicle and allows it to finish",()=>{
  const skipped={...base,status:"USER_ARRIVED",userProgressPercent:100,carProgressPercent:21};
  const t=advanceDemoTimeline(skipped,72000).trip;
  assert.equal(t.userProgressPercent,100);
  assert.ok(t.carProgressPercent>21);
  assert.equal(t.status,"USER_ARRIVED");
  assert.equal(advanceDemoTimeline(t,141000).trip.status,"COMPLETED");
});
test("skip towing first never prevents the passenger from progressing",()=>{
  const skipped={...base,status:"VEHICLE_ARRIVED",carProgressPercent:100};
  const t=advanceDemoTimeline(skipped,56000).trip;
  assert.equal(t.carProgressPercent,100);
  assert.equal(t.userProgressPercent,50);
  assert.equal(t.status,"VEHICLE_ARRIVED");
  assert.equal(advanceDemoTimeline(t,111000).trip.status,"COMPLETED");
});
test("search and approach clocks survive page navigation",()=>{
  assert.equal(advanceDemoTimeline({status:"SEARCHING_TANDEM",searchStartedAt:1000},11001).trip.status,"TANDEM_ASSIGNED");
  assert.equal(advanceDemoTimeline({status:"TANDEM_APPROACHING",approachStartedAt:1000},37000).trip.status,"TANDEM_ARRIVED");
});
test("the first tick initializes missing old-clock timestamps safely",()=>{
  const older={...base,travelStartedAt:undefined,userProgressPercent:57,carProgressPercent:12};
  const updated=advanceDemoTimeline(older,400000).trip;
  assert.equal(updated.userProgressPercent,57);
  assert.equal(updated.carProgressPercent,12);
  assert.equal(updated.travelStartedAt,400000);
});
test("stale and invalid time never create invalid progress",()=>{
  assert.equal(advanceDemoTimeline(base,NaN).changed,false);
  assert.equal(demoVisualProgress(100,1000,DEMO_DURATIONS.passenger,5000),100);
  assert.equal(demoVisualProgress(0,1000,DEMO_DURATIONS.vehicle,71000),50);
});
