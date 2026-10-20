/** Hand-crafted, scale-independent top-down vehicle silhouettes for map tracking. */
export type MovingVehicle = "bike" | "car" | "tow";
export type Waypoint = "pickup" | "passenger" | "workshop";
const white = "#F5F8F8";
function vehicleBody(kind: MovingVehicle): string {
  if (kind === "bike") return `
    <ellipse cx="32" cy="13" rx="6.5" ry="9" fill="#182E3D" stroke="#F6F9FB" stroke-width="1.8"/>
    <ellipse cx="32" cy="48" rx="6.5" ry="9" fill="#182E3D" stroke="#F6F9FB" stroke-width="1.8"/>
    <path d="M18 25h28M20 30l5 9h14l5-9" fill="none" stroke="#F3F6F7" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M32 19c-8 0-11 7-11 15s4 10 11 10 11-2 11-10-3-15-11-15Z" fill="#B9D2DC" stroke="#122F44" stroke-width="2"/>
    <path d="M32 23c-5 0-8 4-8 9 0 4 3 7 8 7s8-3 8-7c0-5-3-9-8-9Z" fill="#203F53"/>
    <ellipse cx="32" cy="27" rx="6" ry="6" fill="#F4F4EF"/><path d="M29 21h6l2 8h-10Z" fill="#67899B"/>
  `;
  if (kind === "car") return `
    <rect x="19" y="8" width="26" height="48" rx="9" fill="#0D2D42" stroke="#F5F8F8" stroke-width="2"/>
    <rect x="21.5" y="10.5" width="21" height="41" rx="8" fill="#C2D8E2"/>
    <path d="M21.5 22h21M21.5 42h21" stroke="#244B62" stroke-width="3"/>
    <rect x="23" y="25" width="18" height="14" rx="3" fill="#3D6C83"/>
    <path d="M22 12h20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <rect x="17" y="23" width="3" height="10" rx="1.5" fill="#152A38"/>
    <rect x="44" y="23" width="3" height="10" rx="1.5" fill="#152A38"/>
  `;
  return `
    <rect x="18" y="7" width="28" height="49" rx="7" fill="#213747" stroke="#FFF6EE" stroke-width="2"/>
    <rect x="20.5" y="9.5" width="23" height="17" rx="4" fill="#D6E5E8"/>
    <rect x="21" y="29" width="22" height="23" rx="3" fill="#DFE3E0" stroke="#263847" stroke-width="1.5"/>
    <path d="M25 32v17m14-17v17" stroke="#83969C" stroke-width="2"/>
    <rect x="22" y="16" width="19" height="5" rx="2" fill="#70909F"/>
    <path d="M22 12h20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <rect x="16" y="34" width="3" height="10" rx="1" fill="#273744"/><rect x="45" y="34" width="3" height="10" rx="1" fill="#273744"/>
  `;
}
/** Vehicle nose points to the top, and only its silhouette rotates at turns. */
export function vehicleSvg(kind: MovingVehicle, bearing = 0): string {
  const color = kind === "tow" ? "#B8795E" : kind === "bike" ? "#347A9C" : "#375E78";
  const safeBearing = Number.isFinite(bearing) ? Math.round(bearing) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#071926" opacity=".22"/>
    <circle cx="32" cy="30" r="28" fill="${color}" stroke="${white}" stroke-width="3.5"/>
    <path d="M32 1l-5 8h10Z" fill="#F7EEE3"/>
    <g data-vehicle-heading="true" transform="rotate(${safeBearing} 32 32)">
      ${vehicleBody(kind)}
    </g>
  </svg>`;
}
export function waypointSvg(kind: Waypoint): string {
  const color = kind === "workshop" ? "#BB7956" : kind === "passenger" ? "#347A9C" : "#1A394C";
  const shape = kind === "pickup"
    ? '<circle cx="32" cy="31" r="8" fill="#F8FCFC"/><circle cx="32" cy="31" r="3" fill="#1A394C"/>'
    : kind === "passenger"
    ? '<path d="M32 15a12 12 0 0 0-12 12c0 10 12 22 12 22s12-12 12-22a12 12 0 0 0-12-12Zm0 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" fill="#F8FCFC"/>'
    : '<path d="M32 14 49 31 32 48 15 31Z" fill="#F8FCFC"/><circle cx="32" cy="31" r="6" fill="#BB7956"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
    <circle cx="32" cy="33" r="27" fill="#091923" opacity=".18"/>
    <circle cx="32" cy="29" r="25" fill="${color}" stroke="#F8FCFC" stroke-width="3.5"/>
    ${shape}
  </svg>`;
}
/** Compass bearing, degrees clockwise from north, for a forward-facing SVG. */
export function routeBearing(a: { lat:number; lng:number }, b: { lat:number; lng:number }): number {
  const dy = b.lat - a.lat;
  const dx = (b.lng - a.lng) * Math.cos((a.lat + b.lat) * Math.PI / 360);
  if (Math.abs(dx) + Math.abs(dy) < 1e-10) return 0;
  return Math.atan2(dx, dy) * 180 / Math.PI;
}
