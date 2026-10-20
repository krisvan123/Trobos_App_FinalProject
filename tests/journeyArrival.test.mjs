import {test} from "node:test";
import assert from "node:assert/strict";
import {resolveDemoArrival} from "../src/lib/journeyArrival.ts";

test("passenger can be skipped while towing continues",()=>{
  const a=resolveDemoArrival("TRIP_STARTED",24,37,"passenger");
  assert.deepEqual(a,{status:"USER_ARRIVED",passengerProgress:100,vehicleProgress:37});
});
test("towing can be skipped first without stopping passenger",()=>{
  const a=resolveDemoArrival("TRIP_STARTED",24,37,"vehicle");
  assert.deepEqual(a,{status:"VEHICLE_ARRIVED",passengerProgress:24,vehicleProgress:100});
});
test("second arrival completes regardless of order",()=>{
  const a=resolveDemoArrival("USER_ARRIVED",100,49,"vehicle");
  const b=resolveDemoArrival("VEHICLE_ARRIVED",53,100,"passenger");
  assert.equal(a.status,"COMPLETED");assert.equal(b.status,"COMPLETED");
  assert.equal(a.passengerProgress,100);assert.equal(b.vehicleProgress,100);
});
test("nonmoving phases cannot be prematurely skipped",()=>{
  for(const s of ["IDLE","REQUESTED","SEARCHING_TANDEM","VEHICLE_HANDOVER","COMPLETED"]) {
    assert.equal(resolveDemoArrival(s,0,0,"vehicle"),null);
  }
});
