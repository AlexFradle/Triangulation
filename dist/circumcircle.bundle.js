(()=>{"use strict";const t=(t,e,n)=>Math.acos((e*e+n*n-t*t)/(2*e*n)),e=(t,e)=>Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)),n=(n,o,a)=>{const r=e(n,o),s=e(n,a),u=e(o,a),c=t(u,r,s),l=t(s,u,r),g=Math.PI-(c+l),i=Math.sin(2*c),p=Math.sin(2*l),d=Math.sin(2*g),h=i+p+d;return[(n[0]*i+o[0]*p+a[0]*d)/h,(n[1]*i+o[1]*p+a[1]*d)/h]},o=(t,n,o)=>([t,n,o]=[e(t,n),e(t,o),e(n,o)],t*n*o/Math.sqrt((t+n+o)*(n+o-t)*(o+t-n)*(t+n-o))),a=[[310,130],[220,280],[350,130]];new p5((t=>{const e=a;let r=o(...e),s=n(...e);console.log(s,r),((t,e,n)=>{const o=[e[0]-t[0],e[1]-t[1]],a=[n[0]-t[0],n[1]-t[1]],r=2*(o[0]*a[1]-o[1]*a[0]),s=o[0]*o[0]+o[1]*o[1],u=a[0]*a[0]+a[1]*a[1],c=[(a[1]*s-o[1]*u)/r,(o[0]*u-a[0]*s)/r];Math.sqrt(c[0]*c[0]+c[1]*c[1]);t[0],t[1]})(...e),t.setup=()=>{t.createCanvas(1e3,1e3)},t.draw=()=>{r=o(...e),s=n(...e),t.background(220),t.stroke("black"),t.strokeWeight(2),t.triangle(...e[0],...e[1],...e[2]);for(const[n,o]of e)t.strokeWeight(10),t.point(n,o);t.stroke("red"),t.strokeWeight(1),t.noFill(),t.circle(...s,2*r),t.strokeWeight(10),t.point(...s)}}),"canvas"),document.getElementById("p1-x").oninput=t=>{a[0][0]=t.target.value},document.getElementById("p1-y").oninput=t=>{a[0][1]=t.target.value},document.getElementById("p2-x").oninput=t=>{a[1][0]=t.target.value},document.getElementById("p2-y").oninput=t=>{a[1][1]=t.target.value},document.getElementById("p3-x").oninput=t=>{a[2][0]=t.target.value},document.getElementById("p3-y").oninput=t=>{a[2][1]=t.target.value}})();
//# sourceMappingURL=circumcircle.bundle.js.map