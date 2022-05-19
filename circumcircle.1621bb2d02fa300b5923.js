(()=>{"use strict";var t=function(t,r,n){return Math.acos((r*r+n*n-t*t)/(2*r*n))},r=function(t,r){return Math.sqrt(Math.pow(r[0]-t[0],2)+Math.pow(r[1]-t[1],2))},n=function(n,e,o){var a=r(n,e),i=r(n,o),u=r(e,o),l=t(u,a,i),c=t(i,u,a),s=Math.PI-(l+c),f=Math.sin(2*l),h=Math.sin(2*c),y=Math.sin(2*s),d=f+h+y;return[(n[0]*f+e[0]*h+o[0]*y)/d,(n[1]*f+e[1]*h+o[1]*y)/d]},e=function(t,n,e){var o=[r(t,n),r(t,e),r(n,e)];return(t=o[0])*(n=o[1])*(e=o[2])/Math.sqrt((t+n+e)*(n+e-t)*(e+t-n)*(t+n-e))},o=function(t,r,n){var e=[r[0]-t[0],r[1]-t[1]],o=[n[0]-t[0],n[1]-t[1]],a=2*(e[0]*o[1]-e[1]*o[0]),i=e[0]*e[0]+e[1]*e[1],u=o[0]*o[0]+o[1]*o[1],l=[(o[1]*i-e[1]*u)/a,(e[0]*u-o[0]*i)/a],c=Math.sqrt(l[0]*l[0]+l[1]*l[1]);return{center:[l[0]+t[0],l[1]+t[1]],radius:c}},a=function(t){throw new Error(t)};function i(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var e,o,a=[],i=!0,u=!1;try{for(n=n.call(t);!(i=(e=n.next()).done)&&(a.push(e.value),!r||a.length!==r);i=!0);}catch(t){u=!0,o=t}finally{try{i||null==n.return||n.return()}finally{if(u)throw o}}return a}(t,r)||l(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t){return function(t){if(Array.isArray(t))return c(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||l(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,r){if(t){if("string"==typeof t)return c(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,r):void 0}}function c(t,r){(null==r||r>t.length)&&(r=t.length);for(var n=0,e=new Array(r);n<r;n++)e[n]=t[n];return e}var s=new Proxy(new URLSearchParams(window.location.search),{get:function(t,r){return t.get(r)}}),f=null!==s.width?"max"===s.width?window.innerWidth:isNaN(+s.width)?a("incorrect width"):+s.width:1e3,h=null!==s.height?"max"===s.height?window.innerHeight:isNaN(+s.height)?a("incorrect height"):+s.height:1e3,y=[[310,130],[220,280],[350,130]];new p5((function(t){var a=y,c=e.apply(void 0,u(a)),s=n.apply(void 0,u(a));console.log(s,c);var d=o.apply(void 0,u(a)),p=null;t.setup=function(){t.createCanvas(f,h)},t.draw=function(){c=e.apply(void 0,u(a)),s=n.apply(void 0,u(a)),d=o.apply(void 0,u(a)),t.background(32),t.stroke("blue"),t.strokeWeight(10),t.noFill(),t.circle.apply(t,u(s).concat([2*c])),t.strokeWeight(10),t.point.apply(t,u(s)),t.stroke(0,255,0),t.strokeWeight(1),t.circle.apply(t,u(d.center).concat([2*d.radius])),t.strokeWeight(5),t.point.apply(t,u(d.center)),t.stroke("red"),t.strokeWeight(2),t.triangle.apply(t,u(a[0]).concat(u(a[1]),u(a[2])));var f,h=function(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=l(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var e=0,o=function(){};return{s:o,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){u=!0,a=t},f:function(){try{i||null==n.return||n.return()}finally{if(u)throw a}}}}(a);try{for(h.s();!(f=h.n()).done;){var v=i(f.value,2),m=v[0],w=v[1];t.strokeWeight(10),t.point(m,w)}}catch(t){h.e(t)}finally{h.f()}t.mousePressed=function(){for(var n=0;n<y.length;n++){var e=i(y[n],2),o=e[0],a=e[1];r([t.mouseX,t.mouseY],[o,a])<20&&(p=n)}},t.mouseDragged=function(){var n=i(y[p],2),e=n[0],o=n[1];r([t.mouseX,t.mouseY],[e,o])<20&&(y[p]=[t.mouseX,t.mouseY])}}}),"canvas")})();
//# sourceMappingURL=circumcircle.1621bb2d02fa300b5923.js.map