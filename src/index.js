import {
    randint,
    dist,
    getSuperTriangle,
    getParams,
    errorGenerator,
    betterMethod, lerpColor, hexToRgb, getBoundingBoxPoints, makeTriangulation, makeRandomVector
} from "./utils";

const params = getParams();

// this is the worst thing ive ever written
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

const NUM_OF_POINTS = params.points !== null
    ? (!isNaN(+params.points)
        ? +params.points
        : errorGenerator("points incorrect"))
    : 20;

const SHOW_VERTS = params.verts !== null
    ? (!isNaN(+params.verts)
        ? +params.verts === 1
        : errorGenerator("incorrect verts"))
    : true;

const MOVE_POINTS = params.move !== null
    ? (!isNaN(+params.move)
        ? +params.move === 1
        : errorGenerator("incorrect move"))
    : true;

const MAX_SPEED = params.speed !== null
    ? (!isNaN(+params.speed)
        ? +params.speed
        : errorGenerator("speed incorrect"))
    : 10;

const FILL = params.fill !== null
    ? (!isNaN(+params.fill)
        ? +params.fill === 1
        : errorGenerator("incorrect fill"))
    : true;

const COLOR1 = params.color1 !== null
    ? hexToRgb(params.color1) ?? errorGenerator("incorrect color 1")
    : [0, 32, 0];

const COLOR2 = params.color2 !== null
    ? hexToRgb(params.color2) ?? errorGenerator("incorrect color 2")
    : [0, 255, 0];

let SHOW_CIRCLES = false;

// const BOUNDS = [[100, 100], [100, HEIGHT - 100], [WIDTH - 100, HEIGHT - 100], [WIDTH - 100, 100]];
const BOUNDS = [[0, 0], [0, HEIGHT], [WIDTH, HEIGHT], [WIDTH, 0]];
const BOUNDS_WIDTH = BOUNDS[3][0] - BOUNDS[0][0];
const BOUNDS_HEIGHT = BOUNDS[1][1] - BOUNDS[0][1];

const POINTS = [
    // [0, 0], [0, 1000], [1000, 1000], [1000, 0],
    ...Array(NUM_OF_POINTS).fill(0).map(_ => [randint(BOUNDS[0][0], BOUNDS_WIDTH), randint(BOUNDS[0][1], BOUNDS_HEIGHT)])
];

const sketch = (p) => {
    const points = POINTS;
    const pointsVectors = Array(POINTS.length).fill(0).map(_ => makeRandomVector(MAX_SPEED));
    let triangles = makeTriangulation(POINTS, BOUNDS, {c1: COLOR1, c2: COLOR2, height: HEIGHT});
    let selectedIndex = null;

    const movePoints = () => {
        for (let i = 0; i < POINTS.length; i++) {
            let newX = POINTS[i][0] + (pointsVectors[i].unit.x * pointsVectors[i].magnitude);
            let newY = POINTS[i][1] + (pointsVectors[i].unit.y * pointsVectors[i].magnitude);

            if (newX < BOUNDS[0][0] || newX > BOUNDS[3][0]) {
                pointsVectors[i].unit.x = -pointsVectors[i].unit.x;
                newX = POINTS[i][0] + (pointsVectors[i].unit.x * pointsVectors[i].magnitude);
            }
            if (newY < BOUNDS[0][1] || newY > BOUNDS[2][1]) {
                pointsVectors[i].unit.y = -pointsVectors[i].unit.y;
                newY = POINTS[i][1] + (pointsVectors[i].unit.y * pointsVectors[i].magnitude);
            }

            POINTS[i] = [newX, newY];
        }
    }

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        p.frameRate(60);
    }

    p.draw = () => {
        p.background(32);
        triangles = makeTriangulation(POINTS, BOUNDS,{c1: COLOR1, c2: COLOR2, height: HEIGHT});
        p.noFill();
        p.stroke("red");
        if (MOVE_POINTS) movePoints();
        p.strokeWeight(1);
        if (!FILL) p.noFill();
        for (const t of triangles) {
            p.stroke(...t.color);
            if (FILL) p.fill(...t.color);
            p.triangle(...t.a, ...t.b, ...t.c);
        }

        if (SHOW_VERTS) {
            p.strokeWeight(8);
            p.stroke("black");
            for (const [x, y] of points) {
                p.point(x, y);
            }
        }

        if (SHOW_CIRCLES) {
            p.noFill();
            for (const t of triangles) {
                p.stroke(...t.color);
                p.circle(...t.circumcenter, t.circumradius * 2);
            }
        }
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

// document.getElementById("toggle-fill").onchange = (e) => {
//     FILL = e.target.checked;
// }
