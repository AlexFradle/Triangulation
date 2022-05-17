import {getSuperTriangle} from "./utils";

const POINTS = [[310, 130], [220, 280], [350, 130]];
const sketch = (p) => {
    const points = POINTS;
    const rect = [[80, 20], [80, 240], [160, 240], [160, 20]];
    const [superTri, bigRect] = getSuperTriangle(...rect, true);

    p.setup = () => {
        p.createCanvas(1000, 1000);
    }

    p.draw = () => {
        p.background(220);
        p.stroke("black");
        p.line(...superTri[0], ...superTri[1]);
        p.line(...superTri[1], ...superTri[2]);
        p.line(...superTri[2], ...superTri[0]);
        p.stroke("red");
        p.line(...rect[0], ...rect[1]);
        p.line(...rect[1], ...rect[2]);
        p.line(...rect[2], ...rect[3]);
        p.line(...rect[3], ...rect[0]);
        p.stroke("green");
        p.line(...bigRect[0], ...bigRect[1]);
        p.line(...bigRect[1], ...bigRect[2]);
        p.line(...bigRect[2], ...bigRect[3]);
        p.line(...bigRect[3], ...bigRect[0]);
    }
}
new p5(sketch, "canvas");
