export const cosineRule = (a, b, c) => Math.acos((b*b + c*c - a*a) / (2 * b * c));

export const dist = (p1, p2) => Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

export const distSq = (p1, p2) => Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2);

export const circumcenter = (a, b, c) => {
    const ab = dist(a, b);
    const ac = dist(a, c);
    const bc = dist(b, c);
    const A = cosineRule(bc, ab, ac);
    const B = cosineRule(ac, bc, ab);
    const C = Math.PI - (A + B);
    const sin2A = Math.sin(2 * A);
    const sin2B = Math.sin(2 * B);
    const sin2C = Math.sin(2 * C);
    const denom = sin2A + sin2B + sin2C;
    return [
        (a[0]*sin2A + b[0]*sin2B + c[0]*sin2C) / denom,
        (a[1]*sin2A + b[1]*sin2B + c[1]*sin2C) / denom
    ];
}

export const circumradius = (a, b, c) => {
    [a, b, c] = [dist(a, b), dist(a, c), dist(b, c)];
    return (
        (a * b * c) / Math.sqrt((a + b + c) * (b + c - a) * (c + a - b) * (a + b - c))
    );
}

export const betterMethod = (A, B, C) => {
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

export const randint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export const hexToRgb = (hex) => {
    const match = /(?:[0-9]|[a-f]|[A-F]){6}/.exec(hex);
    if (match === null) return null;
    const num = parseInt(match[0], 16);
    return [
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255
    ];
}

export const lerpColor = (a, b, t) => {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ]
}

export const getLineEquation = (p1, p2) => {
    const m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    const c = p1[1] - m * p1[0];
    return {
        m, c,
        // needs to be function not arrow to access this obj
        func: function(x) {
            return this.m * x + this.c;
        }
    };
}

export const lineIntersection = (le1, le2) => {
    if (le1.m === undefined || le2.m === undefined) {
        throw "an arg is not a line equation";
    }
    const x = (le2.c - le1.c) / (le1.m - le2.m);
    const y = le1.func(x);
    return [x, y];
}

export const getBoundingBoxPoints = (points) => {
    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return [
        [minX, minY],
        [minX, maxY],
        [maxX, maxY],
        [maxX, minY]
    ]
}

export const getScaled = (v, m, scale) => [scale * (v[0] - m[0]) + m[0], scale * (v[1] - m[1]) + m[1]];

export const getSuperTriangle = (P, Q, R, S, example = false) => {
    // Vertex order:
    // b---c
    // |   |
    // a---d
    const scale = 1.05;
    const M = [P[0] + (S[0] - P[0]) / 2, P[1] + (Q[1] - P[1]) / 2];
    const A = getScaled(P, M, scale);
    const B = getScaled(Q, M, scale);
    const C = getScaled(R, M, scale);
    const D = getScaled(S, M, scale);
    const width = D[0] - A[0];
    const height = B[1] - A[1];
    const left = [A[0] - width, A[1]];  // L
    const right = [D[0] + width, D[1]]; // R
    // const I = lineIntersection(getLineEquation(left, B), getLineEquation(right, C));
    const I = [A[0] + width/2, B[1] + height/2];
    if (example) {
        return [[left, I, right], [A, B, C, D]];
    }
    return [left, I, right];
}

// https://stackoverflow.com/a/901144
export const getParams = () => new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

export const errorGenerator = (message) => {
    throw new Error(message);
}


class Triangle {
    constructor(a, b, c, c1, c2, height) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.edges = this.getEdges();
        const {center, radius} = betterMethod(this.a, this.b, this.c);
        this.circumcenter = center;
        this.circumradius = radius;
        this.color = lerpColor(c1, c2, Math.min(...this.points.map(p => p[1])) / height);
    }

    getEdges() {
        return [[this.a, this.b], [this.b, this.c], [this.c, this.a]];
    }

    get points() {
        return [this.a, this.b, this.c];
    }
}

export const makeRandomVector = (max_speed) => {
    const angle = randint(0, 360) * (Math.PI / 180);
    return {
        unit: {x: Math.cos(angle), y: Math.sin(angle)},
        magnitude: randint(1, max_speed) / 10
    }
}

const print_triangle = (t) => console.log(
    `
    a = [${t.a[0]}, ${t.a[1]}]
    b = [${t.b[0]}, ${t.b[1]}]
    c = [${t.c[0]}, ${t.c[1]}]
    `
);

export const makeTriangulation = (points, pointBounds, options) => {
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

    const inCircumcircle = (triangle, p) => {
        // ABSOLUTE ABOMINATION !!!!
        // but it does work correctly
        // https://math.stackexchange.com/questions/4001660/bowyer-watson-algorithm-for-delaunay-triangulation-fails-when-three-vertices-ap
        // https://stackoverflow.com/questions/30741459/bowyer-watson-algorithm-how-to-fill-holes-left-by-removing-triangles-with-sup/36992359#36992359
        // https://stackoverflow.com/questions/58203812/bowyer-watson-triangulates-incorrectly-when-trying-to-implement-circumcircle-cal

        const t = triangle.points.map((v, ind) => ({name: String.fromCharCode(65 + ind), point: v}));
        const pointsAtInf = t.filter(({point}) => superTriangle.points.some(s => point[0] === s[0] && point[1] === s[1]));
        const finite = t.filter(obj => !pointsAtInf.includes(obj));

        // https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
        const d = (x1, y1, x2, y2, px, py) => (px - x1) * (y2 - y1) - (py - y1) * (x2 - x1);

        const side = (d) => d < 0 ? -1 : (d > 0 ? 1 : 0);
        let x1, y1, x2, y2;
        if (pointsAtInf.length === 0) {
            return distSq(p, triangle.circumcenter) < triangle.circumradius * triangle.circumradius;
        } else if (pointsAtInf.length === 1) {
            [[x1, y1], [x2, y2]] = finite.map(f => f.point);

        } else if (pointsAtInf.length === 2) {
            [x1, y1] = finite[0].point;
            x2 = pointsAtInf[0].point[0] - pointsAtInf[1].point[0] + x1;
            y2 = pointsAtInf[0].point[1] - pointsAtInf[1].point[1] + y1;
        } else {
            return true;
        }
        const pSide = side(d(x1, y1, x2, y2, p[0], p[1]));
        const vSide = side(d(x1, y1, x2, y2, ...pointsAtInf[0].point));
        return pSide === vSide;
    }

    const superTriangle = new Triangle(...getSuperTriangle(...pointBounds), options.c1, options.c2, options.height);

    // use simple dist for better speed but isn't accurate in cases where the points are almost a line
    const distFunc = (triangle, point) => {
        if (options.accurate) {
            return inCircumcircle(triangle, point);
        } else {
            return distSq(point, triangle.circumcenter) < triangle.circumradius * triangle.circumradius;
        }
    };

    let triangulation = [];
    triangulation.push(superTriangle);
    for (const point of points) {
        const badTriangles = [];
        for (const triangle of triangulation) {
            if (distFunc(triangle, point)) {
                badTriangles.push(triangle);
            }
        }
        for (const triangle of badTriangles) {
            for (const edge of triangle.edges) {
                const isEdge = badTriangles.filter(t => t !== triangle)
                                           .flatMap(t => t.edges)
                                           .some(e => compareEdges(e, edge));
                if (isEdge === false) {
                    triangulation.push(
                        new Triangle(edge[0], edge[1], point, options.c1, options.c2, options.height)
                    );
                }
            }
            triangulation = triangulation.filter(t => t !== triangle);
        }
    }
    for (const triangle of triangulation) {
        if (triangle.points.some(v => superTriangle.points.some(s => v[0] === s[0] && v[1] === s[1] ))) {
            triangulation = triangulation.filter(t => t !== triangle);
        }
    }
    return triangulation;
}

