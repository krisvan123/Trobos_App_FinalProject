/** Precomputed geometry for lightweight distance-based map animation. */
export type Position={lat:number;lng:number};
export type PreparedRoute={points:Position[]; cumulativeLengths:number[]; totalLength:number};
const clamp=(v:number,min:number,max:number)=>Number.isFinite(v)?Math.max(min,Math.min(max,v)):min;
export function prepareRoute(points:Position[]):PreparedRoute {
 const safe=points.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180);
 const cumulativeLengths=[0];
 for(let i=1;i<safe.length;i++){
  const lat=(safe[i-1].lat+safe[i].lat)*Math.PI/360;
  const x=(safe[i].lng-safe[i-1].lng)*Math.cos(lat),y=safe[i].lat-safe[i-1].lat;
  cumulativeLengths.push(cumulativeLengths[i-1]+Math.hypot(x,y));
 }
 return {points:safe,cumulativeLengths,totalLength:cumulativeLengths[cumulativeLengths.length-1]};
}
export function sampleRoute(route:PreparedRoute,percent:number):Position {
 const {points,cumulativeLengths,totalLength}=route;
 if(!points.length)return {lat:-6.2155,lng:106.8217};
 if(points.length===1||!totalLength)return points[0];
 const dist=clamp(percent,0,100)/100*totalLength;
 if(dist>=totalLength)return points[points.length-1];
 let lo=1,hi=points.length-1;
 while(lo<hi){const mid=Math.floor((lo+hi)/2);if(cumulativeLengths[mid]<dist)lo=mid+1;else hi=mid;}
 const a=lo-1,seg=cumulativeLengths[lo]-cumulativeLengths[a],t=seg>0?clamp((dist-cumulativeLengths[a])/seg,0,1):0;
 return {lat:points[a].lat+(points[lo].lat-points[a].lat)*t,lng:points[a].lng+(points[lo].lng-points[a].lng)*t};
}
export function routeBearing(a:Position,b:Position):number {
 const dy=b.lat-a.lat,dx=(b.lng-a.lng)*Math.cos((a.lat+b.lat)*Math.PI/360);
 return Math.abs(dx)+Math.abs(dy)<1e-10?0:Math.atan2(dx,dy)*180/Math.PI;
}
export function sampleHeading(route:PreparedRoute,percent:number):number {
 const d=Math.min(2,Math.max(.13,15/Math.max(route.points.length,2)));
 return routeBearing(sampleRoute(route,Math.max(0,percent-d)),sampleRoute(route,Math.min(100,percent+d)));
}
