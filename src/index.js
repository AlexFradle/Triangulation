import p5 from "p5";
import { circumcenter, circumradius, randint, dist } from "./utils";

const WIDTH = 1000;
const HEIGHT = 1000;
const NUM_OF_POINTS = 100;


const POINTS = [
    // [0, 0], [0, 1000], [1000, 1000], [1000, 0],
    ...Array(NUM_OF_POINTS).fill(0).map(_ => [randint(0, WIDTH), randint(0, HEIGHT)])
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

const makeTriangulation = (w, h) => {
    const compareEdges = (e1, e2) => {
        return (
            e1[0][0] === e2[0][0] && e1[0][1] === e2[0][1] && e1[1][0] === e2[1][0] && e1[1][1] === e2[1][1]
        ) || (
            e1[1][0] === e2[0][0] && e1[1][1] === e2[0][1] && e1[0][0] === e2[1][0] && e1[0][1] === e2[1][1]
        )
    }
    const superTriangle = new Triangle(
        [-(0.75 * w), -10],
        [w / 2, h + (0.75 * h)],
        [w + (0.75 * w), -10]
    );
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

let FILL = true;
let SHOW_VERTS = false;
let SHOW_CIRCLES = false;

const sketch = (p) => {
    const points = POINTS;
    const pointsVectors = Array(POINTS.length).fill(0).map(_ => makeRandomVector());
    let triangles = makeTriangulation(WIDTH, HEIGHT);
    let selectedIndex = null;

    const movePoints = () => {
        for (let i = 0; i < POINTS.length; i++) {
            let newX = POINTS[i][0] + (pointsVectors[i].unit.x * pointsVectors[i].magnitude);
            let newY = POINTS[i][1] + (pointsVectors[i].unit.y * pointsVectors[i].magnitude);

            if (newX < 0 || newX > WIDTH) {
                pointsVectors[i].unit.x = -pointsVectors[i].unit.x;
                newX = POINTS[i][0] + (pointsVectors[i].unit.x * pointsVectors[i].magnitude);
            }
            if (newY < 0 || newY > HEIGHT) {
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
        triangles = makeTriangulation(WIDTH, HEIGHT)
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

// const POINTS = [[310, 130], [220, 280], [350, 130]];
// const sketch = (p) => {
//     const points = POINTS;
//     let cr = circumradius(...points);
//     let cc = circumcenter(...points);
//
//     p.setup = () => {
//         p.createCanvas(1000, 1000);
//     }
//
//     p.draw = () => {
//         cr = circumradius(...points);
//         cc = circumcenter(...points);
//         p.background(220);
//         p.stroke("black");
//         p.strokeWeight(2);
//         p.triangle(...points[0], ...points[1], ...points[2]);
//         for (const [x, y] of points) {
//             p.strokeWeight(10);
//             p.point(x, y);
//         }
//         p.stroke("red");
//         p.strokeWeight(1);
//         p.noFill();
//         p.circle(...cc, cr * 2);
//         p.strokeWeight(10);
//         p.point(...cc);
//     }
// }
//
// new p5(sketch, "canvas");
//
// document.getElementById("p1-x").oninput = (e) => {
//     POINTS[0][0] = e.target.value;
// }
// document.getElementById("p1-y").oninput = (e) => {
//     POINTS[0][1] = e.target.value;
// }
// document.getElementById("p2-x").oninput = (e) => {
//     POINTS[1][0] = e.target.value;
// }
// document.getElementById("p2-y").oninput = (e) => {
//     POINTS[1][1] = e.target.value;
// }
// document.getElementById("p3-x").oninput = (e) => {
//     POINTS[2][0] = e.target.value;
// }
// document.getElementById("p3-y").oninput = (e) => {
//     POINTS[2][1] = e.target.value;
// }
