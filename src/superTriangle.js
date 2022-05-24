import {
    dist,
    errorGenerator,
    getBoundingBoxPoints,
    getParams,
    getSuperTriangle,
} from "./utils";

const params = getParams();

const WIDTH = params.width !== null
    ? (params.width === "max"
        ? window.innerWidth
        : (!isNaN(+params.width)
            ? +params.width
            : errorGenerator("incorrect width")))
    : 1000;

const HEIGHT = params.height !== null
    ? (params.height === "max"
        ? window.innerHeight
        : (!isNaN(+params.height)
            ? +params.height
            : errorGenerator("incorrect height")))
    : 1000;


const POINTS = [[120, 50], [220, 180], [150, 130], [180, 70]];

const sketch = (p) => {
    let rect = getBoundingBoxPoints(POINTS);
    let [superTri, bigRect] = getSuperTriangle(...rect, true);
    console.log(rect, superTri)
    let selectedIndex = null;

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
    }

    p.draw = () => {
        rect = getBoundingBoxPoints(POINTS);
        [superTri, bigRect] = getSuperTriangle(...rect, true);
        p.background(32);
        p.strokeWeight(8);
        p.stroke(0, 255, 0);
        for (const point of POINTS) {
            p.point(...point);
        }
        p.rectMode(p.CORNERS);
        p.stroke("red");
        p.strokeWeight(1);
        p.rect(...rect[0], ...rect[2]);
        p.stroke("blue");
        p.rect(...bigRect[0], ...bigRect[2]);
        p.stroke("yellow");
        p.noFill();
        p.triangle(...superTri[0], ...superTri[1], ...superTri[2]);
    }

    p.mousePressed = () => {
        for (let i = 0; i < POINTS.length; i++) {
            const [x, y] = POINTS[i];
            const d = dist([p.mouseX, p.mouseY], [x, y]);
            if (d < 20) {
                selectedIndex = i;
            }
        }
    }

    p.mouseDragged = () => {
        const [x, y] = POINTS[selectedIndex];
        if (dist([p.mouseX, p.mouseY], [x, y]) < 20) {
            POINTS[selectedIndex] = [p.mouseX, p.mouseY];
        }
    }
}

new p5(sketch, "canvas");
