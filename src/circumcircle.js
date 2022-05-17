import { circumcenter, circumradius } from "./utils";

const betterMethod = (A, B, C) => {
    const Bp = [B[0] - A[0], B[1] - A[1]];
    const Cp = [C[0] - A[0], C[1] - A[1]];
    const Dp = 2 * (Bp[0]*Cp[1] - Bp[1]*Cp[0]);
    const f = Bp[0]*Bp[0] + Bp[1]*Bp[1];
    const g = Cp[0]*Cp[0] + Cp[1]*Cp[1];
    const Up = [
        (Cp[1]*f - Bp[1]*g) / Dp,
        (Bp[0]*g - Cp[0]*f) / Dp
    ];
    const r = Math.sqrt(Up[0]*Up[0] + Up[1]*Up[1]);
    const U = [Up[0] + A[0], Up[1] + A[1]];
    return {center: U, radius: r};
}

const POINTS = [[310, 130], [220, 280], [350, 130]];
const sketch = (p) => {
    const points = POINTS;
    let cr = circumradius(...points);
    let cc = circumcenter(...points);
    console.log(cc, cr);
    betterMethod(...points);

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
