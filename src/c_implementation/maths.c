//
// Created by Alw on 21/05/2022.
//

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "maths.h"

float dist_sq(float x1, float y1, float x2, float y2) {
    return pow(x2 - x1, 2) + pow(y2 - y1, 2);
}

void make_circumcircle(Triangle *triangle) {
    float Bpx = triangle->bx - triangle->ax;
    float Bpy = triangle->by - triangle->ay;
    float Cpx = triangle->cx - triangle->ax;
    float Cpy = triangle->cy - triangle->ay;
    float Dp = 2 * (Bpx*Cpy - Bpy*Cpx);
    float f = Bpx*Bpx + Bpy*Bpy;
    float g = Cpx*Cpx + Cpy*Cpy;

    float Upx = (Cpy*f - Bpy*g) / Dp;
    float Upy = (Bpx*g - Cpx*f) / Dp;

    float radius = sqrt(Upx*Upx + Upy*Upy);
    float Ux = Upx + triangle->ax;
    float Uy = Upy + triangle->ay;

    triangle->center_x = Ux;
    triangle->center_y = Uy;
    triangle->radius = radius;
}

void construct_triangle(
    Triangle *t,
    float ax, float ay,
    float bx, float by,
    float cx, float cy
) {
    t->ax = ax;
    t->ay = ay;
    t->bx = bx;
    t->by = by;
    t->cx = cx;
    t->cy = cy;
    make_circumcircle(t);
}

bool is_in_circumcircle(Triangle *super_triangle, Triangle *triangle, float px, float py) {
    // abomination v2
    int share = share_points(triangle, super_triangle);
    float x1, y1, x2, y2;
    switch (share) {
        case 0: {
            // no share
            return dist_sq(px, py, triangle->center_x, triangle->center_y) < triangle->radius * triangle->radius;
        }
        case 1: {
            // share a
            x1 = triangle->bx;
            y1 = triangle->by;
            x2 = triangle->cx;
            y2 = triangle->cy;
            break;
        }
        case 2: {
            // share b
            x1 = triangle->ax;
            y1 = triangle->ay;
            x2 = triangle->cx;
            y2 = triangle->cy;
            break;
        }
        case 3: {
            // share c
            x1 = triangle->ax;
            y1 = triangle->ay;
            x2 = triangle->bx;
            y2 = triangle->by;
            break;
        }
        case 4: {
            // share a and b
            x1 = triangle->cx;
            y1 = triangle->cy;
            x2 = triangle->ax - triangle->bx + x1;
            y2 = triangle->ay - triangle->by + y1;
            break;
        }
        case 5: {
            // share b and c
            x1 = triangle->ax;
            y1 = triangle->ay;
            x2 = triangle->bx - triangle->cx + x1;
            y2 = triangle->by - triangle->cy + y1;
            break;
        }
        case 6: {
            // share a and c
            x1 = triangle->bx;
            y1 = triangle->by;
            x2 = triangle->ax - triangle->cx + x1;
            y2 = triangle->ay - triangle->cy + y1;
            break;
        }
        case 7: {
            // share a, b, and c
            return true;
        }
        default: {
            printf("how did you get here?\n");
            return true;
        }
    }
    float dp = (px - x1) * (y2 - y1) - (py - y1) * (x2 - x1);
    float dv;
    if (share == 1 || share == 4 || share == 6) dv = (triangle->ax - x1) * (y2 - y1) - (triangle->ay - y1) * (x2 - x1);
    else if (share == 2 || share == 5) dv = (triangle->bx - x1) * (y2 - y1) - (triangle->by - y1) * (x2 - x1);
    else dv = (triangle->cx - x1) * (y2 - y1) - (triangle->cy - y1) * (x2 - x1);
    int p_side = dp < 0 ? -1 : (dp > 0 ? 1 : 0);
    int v_side = dv < 0 ? -1 : (dv > 0 ? 1 : 0);
    return p_side == v_side;
}

bool compare_edges(
    float e1_p1_x, float e1_p1_y,
    float e1_p2_x, float e1_p2_y,
    float e2_p1_x, float e2_p1_y,
    float e2_p2_x, float e2_p2_y
) {
    if (
        (e1_p1_x == e2_p1_x && e1_p1_y == e2_p1_y &&
         e1_p2_x == e2_p2_x && e2_p2_y == e2_p2_y) ||
        (e1_p2_x == e2_p1_x && e1_p2_y == e2_p1_y &&
         e1_p1_x == e2_p2_x && e1_p1_y == e2_p2_y)
    ) {
        return true;
    }
    return false;
}

void make_super_triangle(
    Triangle *triangle,
    float px, float py,
    float qx, float qy,
    float rx, float ry,
    float sx, float sy
) {
    float scale = 1.05f;
    float mx = px + (sx - px) / 2;
    float my = py + (qy - py) / 2;

    float ax = scale * (px - mx) + mx;
    float ay = scale * (py - my) + my;

    float bx = scale * (qx - mx) + mx;
    float by = scale * (qy - my) + my;

    float cx = scale * (rx - mx) + mx;
    float cy = scale * (ry - my) + my;

    float dx = scale * (sx - mx) + mx;
    float dy = scale * (sy - my) + my;

    float width = dx - ax;
    float height = by - ay;

    float left_x = ax - width;
    float left_y = ay;
    float right_x = dx + width;
    float right_y = dy;

    float ix = ax + width/2;
    float iy = by + height/2;

    construct_triangle(
            triangle,
            left_x, left_y,
            ix, iy,
            right_x, right_y
    );
}

void print_triangle(Triangle *triangle) {
    printf(
            "a = [%f, %f]\nb = [%f, %f]\nc = [%f, %f]\n",
            triangle->ax, triangle->ay,
            triangle->bx, triangle->by,
            triangle->cx, triangle->cy
    );
}

bool compare_triangles(Triangle *t1, Triangle *t2) {
    if (
            t1->ax == t2->ax &&
            t1->ay == t2->ay &&
            t1->bx == t2->bx &&
            t1->by == t2->by &&
            t1->cx == t2->cx &&
            t1->cy == t2->cy
            ) {
        return true;
    }
    return false;
}

bool share_a_to_b(Triangle *t1, Triangle *t2) {
    if (
        compare_edges(
            t1->ax, t1->ay, t1->bx, t1->by,
            t2->ax, t2->ay, t2->bx, t2->by
        ) ||
        compare_edges(
            t1->ax, t1->ay, t1->bx, t1->by,
            t2->bx, t2->by, t2->cx, t2->cy
        ) ||
        compare_edges(
            t1->ax, t1->ay, t1->bx, t1->by,
            t2->cx, t2->cy, t2->ax, t2->ay
        )
    ) {
        return true;
    }
    return false;
}

bool share_b_to_c(Triangle *t1, Triangle *t2) {
    if (
        compare_edges(
            t1->bx, t1->by, t1->cx, t1->cy,
            t2->ax, t2->ay, t2->bx, t2->by
        ) ||
        compare_edges(
            t1->bx, t1->by, t1->cx, t1->cy,
            t2->bx, t2->by, t2->cx, t2->cy
        ) ||
        compare_edges(
            t1->bx, t1->by, t1->cx, t1->cy,
            t2->cx, t2->cy, t2->ax, t2->ay
        )
    ) {
        return true;
    }
    return false;
}

bool share_c_to_a(Triangle *t1, Triangle *t2) {
    if (
        compare_edges(
            t1->cx, t1->cy, t1->ax, t1->ay,
            t2->ax, t2->ay, t2->bx, t2->by
        ) ||
        compare_edges(
            t1->cx, t1->cy, t1->ax, t1->ay,
            t2->bx, t2->by, t2->cx, t2->cy
        ) ||
        compare_edges(
            t1->cx, t1->cy, t1->ax, t1->ay,
            t2->cx, t2->cy, t2->ax, t2->ay
        )
    ) {
        return true;
    }
    return false;
}

int share_points(Triangle *t1, Triangle *t2) {
    // none = 0
    // a = 1
    // b = 2
    // c = 3
    // a, b = 4
    // b, c = 5
    // a, c = 6
    // a, b, c = 7
    bool share_a = false,
         share_b = false,
         share_c = false;
    if (
        // t1 a in t2
        (t1->ax == t2->ax && t1->ay == t2->ay) ||
        (t1->ax == t2->bx && t1->ay == t2->by) ||
        (t1->ax == t2->cx && t1->ay == t2->cy)
    ) {
        share_a = true;
    }
    if (
        // t1 b in t2
        (t1->bx == t2->ax && t1->by == t2->ay) ||
        (t1->bx == t2->bx && t1->by == t2->by) ||
        (t1->bx == t2->cx && t1->by == t2->cy)
    ) {
        share_b = true;
    }
    if (
        // t1 c in t2
        (t1->cx == t2->ax && t1->cy == t2->ay) ||
        (t1->cx == t2->bx && t1->cy == t2->by) ||
        (t1->cx == t2->cx && t1->cy == t2->cy)
    ) {
        share_c = true;
    }
    // kill me?
    if (!(share_a || share_b || share_c)) return 0;
    if (share_a && share_b && share_c) return 7;
    if (share_a && share_b) return 4;
    if (share_b && share_c) return 5;
    if (share_a && share_c) return 6;
    if (share_a) return 1;
    if (share_b) return 2;
    if (share_c) return 3;
}

