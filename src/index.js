import {
    randint,
    dist,
    getSuperTriangle,
    getParams,
    errorGenerator,
    betterMethod, lerpColor, hexToRgb, getBoundingBoxPoints
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

class Triangle {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.edges = this.getEdges();
        const {center, radius} = betterMethod(this.a, this.b, this.c);
        this.circumcenter = center;
        this.circumradius = radius;
        this.color = lerpColor(COLOR1, COLOR2, Math.min(...this.points.map(p => p[1])) / HEIGHT);
    }

    getEdges() {
        return [[this.a, this.b], [this.b, this.c], [this.c, this.a]];
    }

    get points() {
        return [this.a, this.b, this.c];
    }
}

const makeRandomVector = () => {
    const angle = randint(0, 360) * (Math.PI / 180);
    return {
        unit: {x: Math.cos(angle), y: Math.sin(angle)},
        magnitude: randint(1, MAX_SPEED) / 10
    }
}

const makeTriangulation = (points, pointBounds) => {
    const compareEdges = (e1, e2) => {
        return (
            e1[0][0] === e2[0][0] &&
            e1[0][1] === e2[0][1] &&
            e1[1][0] === e2[1][0] &&
            e1[1][1] === e2[1][1]
        ) || (
            e1[1][0] === e2[0][0] &&
            e1[1][1] === e2[0][1] &&
            e1[0][0] === e2[1][0] &&
            e1[0][1] === e2[1][1]
        )
    }
    const superTriangle = new Triangle(...getSuperTriangle(...pointBounds));

    let triangulation = [];
    triangulation.push(superTriangle);
    for (const point of points) {
        const badTriangles = [];
        for (const triangle of triangulation) {
            if (dist(point, triangle.circumcenter) < triangle.circumradius) {
                badTriangles.push(triangle);
            }
        }
        // const polygon = [];
        for (const triangle of badTriangles) {
            for (const edge of triangle.edges) {
                // remove current triangle, get all edges
                const isEdge = badTriangles.filter(t => t !== triangle)
                                           .flatMap(t => t.edges)
                                           .find(e => compareEdges(e, edge));
                if (isEdge === undefined) {
                    const newTri = new Triangle(edge[0], edge[1], point);
                    triangulation.push(newTri);
                }
            }
            triangulation = triangulation.filter(t => t !== triangle);
        }
        // for (const triangle of badTriangles) {
        //     triangulation = triangulation.filter(t => t !== triangle);
        // }
        // for (const edge of polygon) {
        //     const newTri = new Triangle(edge[0], edge[1], point);
        //     triangulation.push(newTri);
        // }
    }
    for (const triangle of triangulation) {
        if (triangle.points.some(v => superTriangle.points.includes(v))) {
            triangulation = triangulation.filter(t => t !== triangle);
        }
    }
    return triangulation;
}

console.log(makeTriangulation([[120, 50], [220, 180], [150, 130], [180, 70]], getBoundingBoxPoints([[120, 50], [220, 180], [150, 130], [180, 70]])))

const sketch = (p) => {
    const points = POINTS;
    const pointsVectors = Array(POINTS.length).fill(0).map(_ => makeRandomVector());
    let triangles = makeTriangulation(POINTS, BOUNDS);
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
        triangles = makeTriangulation(POINTS, BOUNDS);
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
