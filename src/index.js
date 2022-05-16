import p5 from "p5";
import { circumcenter, circumradius, randint, dist, getSuperTriangle } from "./utils";

const WIDTH = 1000;
const HEIGHT = 1000;
const NUM_OF_POINTS = 20;
let FILL = true;
let SHOW_VERTS = true;
let SHOW_CIRCLES = false;

const BOUNDS = [[100, 100], [100, HEIGHT - 100], [WIDTH - 100, HEIGHT - 100], [WIDTH - 100, 100]];
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
        this.circumcenter = circumcenter(this.a, this.b, this.c);
        this.circumradius = circumradius(this.a, this.b, this.c);
        this.color = [
            0,
            255 * (Math.min(...this.points.map(p => p[1])) / HEIGHT),
            // 255 * (1 - ((Math.min(...this.points.map(p => p[1])) / HEIGHT)))
            255 * (Math.min(...this.points.map(p => p[1])) / HEIGHT)
        ];
    }

    getEdges() {
        return [[this.a, this.b], [this.b, this.c], [this.c , this.a]]
    }

    get points() {
        return [this.a, this.b, this.c];
    }
}

const makeRandomVector = () => {
    const angle = randint(0, 360) * (Math.PI / 180);
    return {
        unit: {x: Math.cos(angle), y: Math.sin(angle)},
        magnitude: randint(1, 3)
    }
}

const makeTriangulation = (pointBounds) => {
    const compareEdges = (e1, e2) => {
        return (
            e1[0][0] === e2[0][0] && e1[0][1] === e2[0][1] && e1[1][0] === e2[1][0] && e1[1][1] === e2[1][1]
        ) || (
            e1[1][0] === e2[0][0] && e1[1][1] === e2[0][1] && e1[0][0] === e2[1][0] && e1[0][1] === e2[1][1]
        )
    }
    const superTriangle = new Triangle(...getSuperTriangle(...pointBounds));
    console.log(superTriangle);

    let triangulation = [];
    triangulation.push(superTriangle);
    for (const point of POINTS) {
        const badTriangles = [];
        for (const triangle of triangulation) {
            if (dist(point, triangle.circumcenter) < triangle.circumradius) {
                badTriangles.push(triangle);
            }
        }
        const polygon = [];
        for (const triangle of badTriangles) {
            for (const edge of triangle.edges) {
                if (
                    badTriangles.filter(tri => tri !== triangle)   // remove current triangle
                                .flatMap(tri => tri.edges) // get all edges of triangles
                                .find(e => compareEdges(e, edge)) === undefined
                ) {
                    polygon.push(edge);
                }
            }
        }
        for (const triangle of badTriangles) {
            triangulation = triangulation.filter(tri => tri !== triangle);
        }
        for (const edge of polygon) {
            const newTri = new Triangle(edge[0], edge[1], point);
            triangulation.push(newTri);
        }
    }
    for (const triangle of triangulation) {
        if (triangle.points.some(vert => superTriangle.points.includes(vert))) {
            triangulation = triangulation.filter(tri => tri !== triangle);
        }
    }
    return triangulation;
}



const sketch = (p) => {
    const points = POINTS;
    const pointsVectors = Array(POINTS.length).fill(0).map(_ => makeRandomVector());
    // const bounds = [[0, 0], [0, HEIGHT], [WIDTH, HEIGHT], [WIDTH, 0]];
    let triangles = makeTriangulation(BOUNDS);
    let selectedIndex = null;

    const movePoints = () => {
        for (let i = 0; i < POINTS.length; i++) {
            let newX = POINTS[i][0] + (pointsVectors[i].unit.x * pointsVectors[i].magnitude);
            let newY = POINTS[i][1] + (pointsVectors[i].unit.y * pointsVectors[i].magnitude);

            if (newX < BOUNDS[0][0] || newX > BOUNDS[3][0]) {
                pointsVectors[i].unit.x = -pointsVectors[i].unit.x;
                newX = POINTS[i][0] + (pointsVectors[i].unit.x * pointsVectors[i].magnitude);
            }
            if (newY < BOUNDS[0][1] || newY > BOUNDS[2][0]) {
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
        p.background(255);
        triangles = makeTriangulation(BOUNDS);
        p.noFill();
        p.stroke("red");
        p.rect(100, 100, BOUNDS_WIDTH, BOUNDS_HEIGHT);
        movePoints();
        p.strokeWeight(1);
        if (!FILL) p.noFill();
        for (const t of triangles) {
            p.stroke(...t.color);
            if (FILL) p.fill(...t.color);
            p.triangle(...t.a, ...t.b, ...t.c);
        }

        if (SHOW_VERTS) {
            p.strokeWeight(10);
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
document.getElementById("toggle-fill").onchange = (e) => {
    FILL = e.target.checked;
}

