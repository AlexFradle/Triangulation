import {
    dist,
    errorGenerator,
    getBoundingBoxPoints,
    getParams,
    getSuperTriangle, makeTriangulation, randint,
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

// const sketch = (p) => {
//     let rect = getBoundingBoxPoints(POINTS);
//     let [superTri, bigRect] = getSuperTriangle(...rect, true);
//     console.log(rect, superTri)
//     let selectedIndex = null;
//     let tris = makeTriangulation(POINTS, rect, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT});
//
//     p.setup = () => {
//         p.createCanvas(WIDTH, HEIGHT);
//     }
//
//     p.draw = () => {
//         rect = getBoundingBoxPoints(POINTS);
//         [superTri, bigRect] = getSuperTriangle(...rect, true);
//         tris = makeTriangulation(POINTS, rect, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT});
//
//         p.background(32);
//         p.strokeWeight(8);
//         p.stroke(0, 255, 0);
//         for (const point of POINTS) {
//             p.point(...point);
//         }
//         p.rectMode(p.CORNERS);
//         p.stroke("red");
//         p.strokeWeight(1);
//         p.rect(...rect[0], ...rect[2]);
//         p.stroke("blue");
//         p.rect(...bigRect[0], ...bigRect[2]);
//         p.stroke("yellow");
//         p.noFill();
//         p.triangle(...superTri[0], ...superTri[1], ...superTri[2]);
//         p.stroke("pink");
//         p.noFill();
//         for (const t of tris) {
//             p.triangle(...t.a, ...t.b, ...t.c);
//         }
//     }
//
//     p.mousePressed = () => {
//         for (let i = 0; i < POINTS.length; i++) {
//             const [x, y] = POINTS[i];
//             const d = dist([p.mouseX, p.mouseY], [x, y]);
//             if (d < 20) {
//                 selectedIndex = i;
//             }
//         }
//     }
//
//     p.mouseDragged = () => {
//         const [x, y] = POINTS[selectedIndex];
//         if (dist([p.mouseX, p.mouseY], [x, y]) < 20) {
//             POINTS[selectedIndex] = [p.mouseX, p.mouseY];
//         }
//     }
// }
//
// new p5(sketch, "canvas");


// emcc main.c maths.c linked_list.c -o trig.js -O3 -s NO_EXIT_RUNTIME=1 -sEXPORTED_RUNTIME_METHODS=getValue -sEXPORTED_FUNCTIONS=_free,_malloc,_make_triangulation
function transferToHeap(arr) {
    const floatArray = arr;
    const heapSpace = Module._malloc(floatArray.length * floatArray.BYTES_PER_ELEMENT);
    Module.HEAPF32.set(floatArray, heapSpace / 4);
    return heapSpace;
}

function trig(ps, pbs, num) {
    let psHeap = transferToHeap(ps);
    let pbsHeap = transferToHeap(pbs);
    let ptr = Module._make_triangulation(psHeap, pbsHeap, num);
    const arrLen = Module.getValue(ptr, "float");
    const triLen = arrLen / 6;
    ptr += 4;
    const newArr = Array(triLen);
    for (let i = 0; i < triLen; i++) {
        newArr[i] = {
            a: [Module.getValue(ptr + i*6*4, "float"), Module.getValue(ptr + 4 + i*6*4, "float")],
            b: [Module.getValue(ptr + 8 + i*6*4, "float"), Module.getValue(ptr + 12 + i*6*4, "float")],
            c: [Module.getValue(ptr + 16 + i*6*4, "float"), Module.getValue(ptr + 20 + i*6*4, "float")]
        }
    }
    Module._free(ptr - 4);
    Module._free(ps);
    Module._free(pbs);
    return newArr;
}



Module.onRuntimeInitialized = function() {

    function mainFunc() {
        const num_of_points = 20;
        const bounds = [[0, 0], [0, HEIGHT], [WIDTH, HEIGHT], [WIDTH, 0]];
        const bounds_width = bounds[3][0] - bounds[0][0];
        const bounds_height = bounds[1][1] - bounds[0][1];
        // let newPoints = [
        //     // [0, 0], [0, 1000], [1000, 1000], [1000, 0],
        //     ...Array(num_of_points).fill(0).map(_ => [randint(bounds[0][0], bounds_width), randint(bounds[0][1], bounds_height)])
        // ];
        const flatPoints = [740, 850, 200, 640, 794, 253, 423, 297, 423, 97, 423, 434, 740, 530, 128, 310, 924, 466, 937, 681, 937, 211, 794, 365, 696, 67, 464, 235, 514, 250, 598, 533, 372, 559, 700, 472, 642, 62, 987, 352];
        let newPoints = [];
        for (let i = 0; i < flatPoints.length; i += 2) {
            newPoints.push([flatPoints[i], flatPoints[i + 1]]);
        }

        console.log(newPoints);
        let bb = getBoundingBoxPoints(newPoints);
        console.log(bb)
        console.log(getSuperTriangle(...bb));
        let a = performance.now();
        let trigJS = makeTriangulation(newPoints, bb, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT}).map(t => ({a: t.a, b: t.b, c: t.c}));
        let b = performance.now();
        console.log(b - a);
        a = performance.now();
        let trigC = trig(new Float32Array(newPoints.flat()), new Float32Array(bb.flat()), newPoints.length);
        b = performance.now();
        console.log(b - a)

        console.log(trigJS);
        console.log(trigC);

        const sketch = (p) => {
            let selectedIndex = null;
            p.setup = () => {
                p.createCanvas(WIDTH, HEIGHT);
            }

            p.draw = () => {
                p.background(32);
                p.strokeWeight(4);
                p.stroke(0, 255, 0);
                for (const point of newPoints) {
                    p.point(...point);
                }
                p.stroke("pink");
                p.noFill();
                for (const t of trigJS) {
                    p.triangle(...t.a, ...t.b, ...t.c);
                }
                p.stroke("red");
                p.noFill();
                p.strokeWeight(2);
                for (const t of trigC) {
                    p.triangle(...t.a, ...t.b, ...t.c);
                }
            }
            p.mousePressed = () => {
                for (let i = 0; i < newPoints.length; i++) {
                    const [x, y] = newPoints[i];
                    const d = dist([p.mouseX, p.mouseY], [x, y]);
                    if (d < 20) {
                        selectedIndex = i;
                    }
                }
            }

            p.mouseDragged = () => {
                const [x, y] = newPoints[selectedIndex];
                if (dist([p.mouseX, p.mouseY], [x, y]) < 20) {
                   newPoints[selectedIndex] = [p.mouseX, p.mouseY];
                    bb = getBoundingBoxPoints(newPoints);
                    trigJS = makeTriangulation(newPoints, bb, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT}).map(t => ({a: t.a, b: t.b, c: t.c}));
                    trigC = trig(new Float32Array(newPoints.flat()), new Float32Array(bb.flat()), newPoints.length);
                }
            }
        }

        new p5(sketch, "canvas");
        document.getElementById("bu").onclick = () => {
            // newPoints = [
            //     // [0, 0], [0, 1000], [1000, 1000], [1000, 0],
            //     ...Array(num_of_points).fill(0).map(_ => [randint(bounds[0][0], bounds_width), randint(bounds[0][1], bounds_height)])
            // ];
            console.log(newPoints);
            // bb = getBoundingBoxPoints(newPoints);
            // trigJS = makeTriangulation(newPoints, bb, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT}).map(t => ({a: t.a, b: t.b, c: t.c}));
            // trigC = trig(new Float32Array(newPoints.flat()), new Float32Array(bb.flat()), newPoints.length);
            // console.log(trigJS);
            // console.log(trigC);
        }
    }
    mainFunc();


}
const a = [740, 850, 200, 640, 794, 253, 423, 297, 423, 97, 423, 434, 740, 530, 128, 310, 924, 466, 937, 681, 937, 211, 794, 365, 696, 67, 464, 235, 514, 250, 598, 533, 372, 559, 700, 472, 642, 62, 987, 352];
