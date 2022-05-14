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
