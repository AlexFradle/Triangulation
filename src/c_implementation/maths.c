#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "maths.h"

float dist(float x1, float y1, float x2, float y2) {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
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

bool is_in_circumcircle(Triangle *triangle, float px, float py) {
    if (dist(px, py, triangle->center_x, triangle->center_y) < triangle->radius) {
        return true;
    }
    return false;
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
    float scale = 1.05;
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

    triangle->ax = left_x;
    triangle->ay = left_y;
    triangle->bx = ix;
    triangle->by = iy;
    triangle->cx = right_x;
    triangle->cy = right_y;
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
