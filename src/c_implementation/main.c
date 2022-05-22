#include <stdio.h>
#include <stdlib.h>
#include <string.h>
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
    // print_triangle(&super_triangle);

    // let triangulation = [];
    Node *triangulation_head = (Node *) malloc(sizeof(Node));

    // https://stackoverflow.com/questions/13284033/copying-structure-in-c-with-assignment-instead-of-memcpy
    Triangle *super_triangle_copy = (Triangle *) malloc(sizeof(Triangle));
    memcpy(super_triangle_copy, &super_triangle, sizeof(Triangle));

    // triangulation.push(superTriangle);
    triangulation_head->val = super_triangle_copy;
    triangulation_head->next = NULL;

    // for (const point of points)
    for (int i = 0; i < number_of_points * 2; i += 2) {
        printf("[%f,%f]\n", points[i], points[i+1]);
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
            print_triangle(current->val);
            // a to b
            if (!some(&bad_triangles_head, current->val, &share_a_to_b, true)) {
                Triangle *new_triangle_ab = malloc(sizeof(Triangle));
                construct_triangle(
                    new_triangle_ab,
                    current->val->ax, current->val->ay,
                    current->val->bx, current->val->by,
                    points[i], points[i  +1]
                );
                push(&triangulation_head, new_triangle_ab);
//                printf("-----AB-----\n");
//                print_triangle(new_triangle_ab);
            }
            // b to c
            if (!some(&bad_triangles_head, current->val, &share_b_to_c, true)) {
                Triangle *new_triangle_bc = malloc(sizeof(Triangle));
                construct_triangle(
                    new_triangle_bc,
                    current->val->bx, current->val->by,
                    current->val->cx, current->val->cy,
                    points[i], points[i + 1]
                );
                push(&triangulation_head, new_triangle_bc);
//                printf("-----BC-----\n");
//                print_triangle(new_triangle_bc);
            }
            // c to a
            if (!some(&bad_triangles_head, current->val, &share_c_to_a, true)) {
                Triangle *new_triangle_ca = malloc(sizeof(Triangle));
                construct_triangle(
                    new_triangle_ca,
                    current->val->cx, current->val->cy,
                    current->val->ax, current->val->ay,
                    points[i], points[i + 1]
                );
                push(&triangulation_head, new_triangle_ca);
//                printf("-----CA-----\n");
//                print_triangle(new_triangle_ca);
            }

            // triangulation = triangulation.filter(t => t !== triangle);
            free(remove_by_value(&triangulation_head, current->val));

            current = current->next;
        }
        delete_linked_list(bad_triangles_head);
    }

    Node *outer_current = triangulation_head;
    Node *final_ll = (Node *) malloc(sizeof(Node));
    memcpy(final_ll, triangulation_head, sizeof(Node));

    while (outer_current != NULL) {
        if (share_points(outer_current->val, &super_triangle)) {
            Triangle *temp_val = outer_current->val;
            outer_current = outer_current->next;
            free(remove_by_value(&final_ll, temp_val));
        } else {
            outer_current = outer_current->next;
        }
    }

    foreach(&final_ll, &print_triangle);
}

int main() {
    float ps[] = {120, 50, 220, 180, 150, 130, 180, 70};
    float pbs[] = {120, 50, 120, 180, 220, 180, 220, 50};
    make_triangulation(ps, pbs, 4);
    return 0;
}

