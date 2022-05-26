import {
    dist,
    errorGenerator,
    getBoundingBoxPoints,
    getParams,
    getSuperTriangle, makeTriangulation,
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
    let tris = makeTriangulation(POINTS, rect, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT});

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
    }

    p.draw = () => {
        rect = getBoundingBoxPoints(POINTS);
        [superTri, bigRect] = getSuperTriangle(...rect, true);
        tris = makeTriangulation(POINTS, rect, {c1: [0, 32, 0], c2: [0, 255, 0], height: HEIGHT});

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
        p.stroke("pink");
        p.noFill();
        for (const t of tris) {
            p.triangle(...t.a, ...t.b, ...t.c);
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


// emcc main.c maths.c linked_list.c -o trig.js -O3 -s NO_EXIT_RUNTIME=1 -sEXPORTED_RUNTIME_METHODS=getValue -sEXPORTED_FUNCTIONS=_free,_malloc,_make_triangulation
function transferToHeap(arr) {
    const floatArray = arr;
    const heapSpace = Module._malloc(floatArray.length * floatArray.BYTES_PER_ELEMENT);
    Module.HEAPF32.set(floatArray, heapSpace / 4);
    return heapSpace;
}

function trig(ps, pbs) {
    let psHeap = transferToHeap(ps);
    let pbsHeap = transferToHeap(pbs);
    let ptr = Module._make_triangulation(psHeap, pbsHeap, 4);
    const arrLen = Module.getValue(ptr, "float");
    const triLen = arrLen / 6;
    ptr += 4;
    const newArr = Array(triLen);
    for (let i = 0; i < triLen; i++) {
        newArr[i] = {
            a: [Module.getValue(ptr + i*4, "float"), Module.getValue(ptr + 4 + i*4, "float")],
            b: [Module.getValue(ptr + 8 + i*4, "float"), Module.getValue(ptr + 12 + i*4, "float")],
            c: [Module.getValue(ptr + 16 + i*4, "float"), Module.getValue(ptr + 20 + i*4, "float")]
        }
    }
    Module._free(ptr - 4);
    Module._free(ps);
    Module._free(pbs);
    return newArr;
}
Module.onRuntimeInitialized = function() {
    console.log(
        trig(
            new Float32Array([120, 50, 217, 201, 165, 132, 152, 93]),
            new Float32Array([120, 50, 120, 201, 217, 201, 217, 50])
        )
    );
}


