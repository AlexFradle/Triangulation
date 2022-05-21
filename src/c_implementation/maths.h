#ifndef MATHS_H
#define MATHS_H

#include <stdbool.h>

typedef struct Triangle {
    float ax;
    float ay;
    float bx;
    float by;
    float cx;
    float cy;
    float center_x;
    float center_y;
    float radius;
} Triangle;

float dist(float x1, float y1, float x2, float y2);
void make_circumcircle(Triangle *triangle);
bool is_in_circumcircle(Triangle *triangle, float px, float py);
bool compare_edges(
    float e1_p1_x, float e1_p1_y,
    float e1_p2_x, float e1_p2_y,
    float e2_p1_x, float e2_p1_y,
    float e2_p2_x, float e2_p2_y
);
void make_super_triangle(
    Triangle *triangle,
    float px, float py,
    float qx, float qy,
    float rx, float ry,
    float sx, float sy
);
void print_triangle(Triangle *triangle);
bool compare_triangles(Triangle *t1, Triangle *t2);

#endif
