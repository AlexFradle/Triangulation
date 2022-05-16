import p5 from "p5";
import { circumcenter, circumradius } from "./utils";

const otherMethod = (a, b, c) => {
    // https://en.wikipedia.org/wiki/Circumscribed_circle#Cartesian_coordinates_2
    const bp = [b[0] - a[0], b[1] - a[1]];
    const cp = [c[0] - a[0], c[1] - a[1]];
    const dp = 2 * (bp[0]*cp[1] - bp[1]*cp[0]);
    const f = bp[0]*bp[0] + bp[1]*bp[1];
    const g = cp[0]*cp[0] + cp[1]*cp[1];
    const uprime = [
        (cp[1]*f - bp[1]*g) / dp,
        (bp[0]*g - cp[0]*f) / dp
    ];
    const r = Math.sqrt(uprime[0]*uprime[0] + uprime[1]*uprime[1]);
    console.log(uprime[0] + a[0], uprime[1] + a[1], r);
}

const POINTS = [[310, 130], [220, 280], [350, 130]];
const sketch = (p) => {
    const points = POINTS;
    let cr = circumradius(...points);
    let cc = circumcenter(...points);
    console.log(cc, cr);
    otherMethod(...points);

    p.setup = () => {
        p.createCanvas(1000, 1000);
    }

    p.draw = () => {
        cr = circumradius(...points);
        cc = circumcenter(...points);
        p.background(220);
        p.stroke("black");
        p.strokeWeight(2);
        p.triangle(...points[0], ...points[1], ...points[2]);
        for (const [x, y] of points) {
            p.strokeWeight(10);
            p.point(x, y);
        }
        p.stroke("red");
        p.strokeWeight(1);
        p.noFill();
        p.circle(...cc, cr * 2);
        p.strokeWeight(10);
        p.point(...cc);
    }
}

new p5(sketch, "canvas");

document.getElementById("p1-x").oninput = (e) => {
    POINTS[0][0] = e.target.value;
}
document.getElementById("p1-y").oninput = (e) => {
    POINTS[0][1] = e.target.value;
}
document.getElementById("p2-x").oninput = (e) => {
    POINTS[1][0] = e.target.value;
}
document.getElementById("p2-y").oninput = (e) => {
    POINTS[1][1] = e.target.value;
}
document.getElementById("p3-x").oninput = (e) => {
    POINTS[2][0] = e.target.value;
}
document.getElementById("p3-y").oninput = (e) => {
    POINTS[2][1] = e.target.value;
}
