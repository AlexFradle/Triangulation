#include <stdio.h>
#include <stdlib.h>
#include "linked_list.h"
#include "maths.h"

// https://www.learn-c.org/en/Linked_lists

void make_triangulation(float points[], float point_bounds[], int number_of_points) {
    // const superTriangle = new Triangle(...getSuperTriangle(...pointBounds));
    Triangle super_triangle;
    make_super_triangle(
        &super_triangle, 
        point_bounds[0], point_bounds[1],
        point_bounds[2], point_bounds[3],
        point_bounds[4], point_bounds[5],
        point_bounds[6], point_bounds[7]
    );
    make_circumcircle(&super_triangle);
    // print_triangle(&super_triangle);

    // let triangulation = [];
    Node *triangulation_head = (Node *) malloc(sizeof(Node));

    // triangulation.push(superTriangle);
    triangulation_head->val = &super_triangle;
    triangulation_head->next = NULL;

    // for (const point of points)
    for (int i = 0; i < number_of_points * 2; i += 2) {
        printf("%d\n", i);
        // const badTriangles = [];
        Node *bad_triangles_head = (Node *) malloc(sizeof(Node));
        bad_triangles_head->val = NULL;
        bad_triangles_head->next = NULL;

        // for (const triangle of triangulation)
        Node *current = triangulation_head;
        while (current != NULL) {
            // if (dist(point, triangle.circumcenter) < triangle.circumradius)
            if (is_in_circumcircle(current->val, points[i], points[i + 1])) {
                // badTriangles.push(triangle)
                if (bad_triangles_head->val == NULL) {
                    bad_triangles_head->val = current->val;
                } else {
                    push(&bad_triangles_head, current->val);
                }
            }
            current = current->next;
        }

        // for (const triangle of badTriangles)
        current = bad_triangles_head;
        while (current != NULL) {
            Node *inner_current = bad_triangles_head;
            while (inner_current != NULL) {
                if (!compare_triangles(inner_current->val, current->val)) {
                    // a to b
                    if (!compare_edges(
                        inner_current->val->ax, inner_current->val->ay,
                        inner_current->val->bx, inner_current->val->by,
                        current->val->ax, current->val->ay,
                        current->val->bx, current->val->by
                    )) {
                        Triangle new_triangle;
                        new_triangle.ax = current->val->ax;
                        new_triangle.ay = current->val->ay;
                        new_triangle.bx = current->val->bx;
                        new_triangle.by = current->val->by;
                        new_triangle.cx = points[i];
                        new_triangle.cy = points[i + 1];
                        make_circumcircle(&new_triangle);
                        push(&triangulation_head, &new_triangle);
                    }
                    // b to c
                    if (!compare_edges(
                        inner_current->val->bx, inner_current->val->by,
                        inner_current->val->cx, inner_current->val->cy,
                        current->val->bx, current->val->by,
                        current->val->cx, current->val->cy
                    )) {
                        Triangle new_triangle;
                        new_triangle.ax = current->val->bx;
                        new_triangle.ay = current->val->by;
                        new_triangle.bx = current->val->cx;
                        new_triangle.by = current->val->cy;
                        new_triangle.cx = points[i];
                        new_triangle.cy = points[i + 1];
                        make_circumcircle(&new_triangle);
                        push(&triangulation_head, &new_triangle);
                    }
                    // c to a
                    if (!compare_edges(
                        inner_current->val->cx, inner_current->val->cy,
                        inner_current->val->ax, inner_current->val->ay,
                        current->val->cx, current->val->cy,
                        current->val->ax, current->val->ay
                    )) {
                        Triangle new_triangle;
                        new_triangle.ax = current->val->cx;
                        new_triangle.ay = current->val->cy;
                        new_triangle.bx = current->val->ax;
                        new_triangle.by = current->val->ay;
                        new_triangle.cx = points[i];
                        new_triangle.cy = points[i + 1];
                        make_circumcircle(&new_triangle);
                        push(&triangulation_head, &new_triangle);
                    }
                }

                inner_current = inner_current->next;
            }

            // triangulation = triangulation.filter(t => t !== triangle);
            remove_by_value(&triangulation_head, current->val);
            
            current = current->next;
        }

        delete_linked_list(bad_triangles_head);
        printf("%d\n", i);
    }

    Node *outer_current = triangulation_head;
    while (outer_current != NULL) {
        if (
            (outer_current->val->ax == super_triangle.ax && outer_current->val->ay == super_triangle.ay) ||
            (outer_current->val->bx == super_triangle.bx && outer_current->val->by == super_triangle.by) ||
            (outer_current->val->cx == super_triangle.cx && outer_current->val->cy == super_triangle.cy)
        ) {
            remove_by_value(&triangulation_head, outer_current->val);
        }

        outer_current = outer_current->next;
    }
    
    foreach(&triangulation_head, &print_triangle);
    

}

int main() {
    float ps[] = {120, 50, 220, 180, 150, 130, 180, 70};
    float pbs[] = {120, 50, 120, 180, 220, 180, 220, 50};
    make_triangulation(ps, pbs, 4);
    return 0;
}
