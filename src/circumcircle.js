import {circumcenter, circumradius, dist, getParams, betterMethod, errorGenerator} from "./utils";

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

const POINTS = [[310, 130], [220, 280], [350, 130]];
const sketch = (p) => {
    const points = POINTS;
    let cr = circumradius(...points);
    let cc = circumcenter(...points);
    console.log(cc, cr);
    let bm = betterMethod(...points);
    let selectedIndex = null;

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
    }

    p.draw = () => {
        cr = circumradius(...points);
        cc = circumcenter(...points);
        bm = betterMethod(...points);
        p.background(32);
        p.stroke("blue");
        p.strokeWeight(10);
        p.noFill();
        p.circle(...cc, cr * 2);
        p.strokeWeight(10);
        p.point(...cc);
        p.stroke(0, 255, 0);
        p.strokeWeight(1);
        p.circle(...bm.center, bm.radius * 2);
        p.strokeWeight(5);
        p.point(...bm.center);
        p.stroke("red");
        p.strokeWeight(2);
        p.triangle(...points[0], ...points[1], ...points[2]);
        for (const [x, y] of points) {
            p.strokeWeight(10);
            p.point(x, y);
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
}

new p5(sketch, "canvas");


