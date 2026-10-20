import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("map routing includes every public fixture pickup and both workshop legs",()=>{
  const map=source("src/components/map/InteractiveMap.tsx");
  assert.match(map,/\.\.\.DEMO_PICKUP_POINTS/);
  assert.match(map,/\.\.\.WORKSHOP_DESTINATIONS/);
  assert.match(map,/let passengerRoad = false, towingRoad = false/);
  assert.match(map,/routeFromOsrmDemo\(originPos, passengerPos\)/);
  assert.match(map,/routeFromOsrmDemo\(originPos, carPos\)/);
  assert.match(map,/"mixed"/);
  assert.match(map,/selectionMode/);
  assert.match(map,/onSelectionComplete\?\.\(\)/);
});
test("guest booking and operator use a shared trip store",()=>{
  const page=source("src/app/driver/page.tsx");
  assert.match(page,/useTrobosStore\(s=>s.currentTrip\)/);
  assert.match(page,/useTrobosStore\(s=>s.assignTandem\)/);
  assert.match(page,/useTrobosStore\(s=>s.sendDriverDemoMessage\)/);
  assert.doesNotMatch(page,/setEarningsToday|Bagi Hasil Driver|hasIncoming/);
});
test("no active coverage claims remain in safety and vehicle descriptions",()=>{
  assert.doesNotMatch(source("src/app/app/safety/page.tsx"),/Rp 1 Miliar|Polis Aktif|Asuransi Derek All-Risk/);
  assert.doesNotMatch(source("src/app/app/vehicles/page.tsx"),/STNK & Proteksi Aktif/);
});
test("tutorial accessible from all in-app routes",()=>{
  const layout=source("src/app/app/layout.tsx");
  assert.match(layout,/OnboardingTutorialModal isOpen=\{tutorialOpen\}/);
});
test("private geolocation isn't sent to free demo route service",()=>{
  const map=source("src/components/map/InteractiveMap.tsx");
  assert.match(map,/if \(!isPublicDemoPoint\(start\) \|\| !isPublicDemoPoint\(end\)\)/);
});
