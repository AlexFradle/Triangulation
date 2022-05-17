export const cosineRule = (a, b, c) => Math.acos((b*b + c*c - a*a) / (2 * b * c));

export const dist = (p1, p2) => Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

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

export const randint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

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

export const getSuperTriangle = (P, Q, R, S, example = false) => {
    // Vertex order:
    // b---c
    // |   |
    // a---d
    const scale = 1.05;
    const M = [P[0] + (S[0] - P[0]) / 2, P[1] + (Q[1] - P[1]) / 2];
    const getScaled = (v) => [scale * (v[0] - M[0]) + M[0], scale * (v[1] - M[1]) + M[1]];
    const A = getScaled(P);
    const B = getScaled(Q);
    const C = getScaled(R);
    const D = getScaled(S);
    const width = D[0] - A[0];
    const left = [A[0] - width, A[1]];  // L
    const right = [D[0] + width, D[1]]; // R
    const I = lineIntersection(getLineEquation(left, B), getLineEquation(right, C));
    if (example) {
        return [[left, I, right], [A, B, C, D]];
    }
    return [left, I, right];
}
